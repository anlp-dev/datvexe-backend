const { Server } = require("socket.io");

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    const userRooms = {}; // Lưu roomId của user để quản lý
    const activeChats = new Set(); // Lưu danh sách userId có chat
    const messageHistory = {}; // Lưu lịch sử tin nhắn theo userId
    const userStatus = {}; // Lưu trạng thái online của người dùng
    const unreadCounts = {}; // Lưu số tin nhắn chưa đọc
    const userLastMessages = {}; // Lưu tin nhắn cuối cùng của mỗi người dùng

    io.on("connection", (socket) => {
        console.log(`🔵 User connected: ${socket.id}`);

        // Khi user join chat với admin
        socket.on("join_chat", (userId) => {
            const roomId = `user_${userId}`;
            socket.join(roomId);
            userRooms[socket.id] = roomId;
            activeChats.add(userId);
            userStatus[userId] = true; // Đánh dấu user online
            
            // Thông báo cho admin biết user đã online
            io.emit("user_status_update", { userId, online: true });
            
            console.log(`👤 User ${userId} joined room: ${roomId}`);
        });

        // Khi admin join chat với user
        socket.on("admin_join_chat", (userId) => {
            const roomId = `user_${userId}`;
            socket.join(roomId);
            console.log(`🛠️ Admin joined room: ${roomId}`);
        });

        // Nhận tin nhắn từ user hoặc admin
        socket.on("send_message", ({ userId, sender, message }) => {
            const roomId = `user_${userId}`;
            const timestamp = new Date().toISOString();
            const messageData = { sender, message, timestamp, read: false };
            
            // Lưu tin nhắn vào lịch sử
            if (!messageHistory[userId]) {
                messageHistory[userId] = [];
            }
            messageHistory[userId].push(messageData);
            
            // Cập nhật tin nhắn cuối cùng
            userLastMessages[userId] = message;
            
            // Tăng số tin nhắn chưa đọc nếu người gửi là user và không phải admin
            if (sender.role === 'USER') {
                unreadCounts[userId] = (unreadCounts[userId] || 0) + 1;
            }
            
            io.to(roomId).emit("receive_message", messageData);
            console.log(`💬 Message in ${roomId}: ${message}`);
        });

        // Lấy danh sách người dùng có chat
        socket.on("get_users_with_chats", () => {
            const chatUsers = Array.from(activeChats).map(userId => ({
                id: userId,
                online: userStatus[userId] || false,
                unreadCount: unreadCounts[userId] || 0,
                lastMessage: userLastMessages[userId] || ''
            }));
            
            socket.emit("users_with_chats", chatUsers);
            console.log(`📋 Sent users with chats list: ${chatUsers.length} users`);
        });

        // Đánh dấu tin nhắn đã đọc
        socket.on("mark_messages_read", ({ userId }) => {
            if (messageHistory[userId]) {
                messageHistory[userId].forEach(msg => {
                    if (msg.sender.role === 'USER') {
                        msg.read = true;
                    }
                });
                unreadCounts[userId] = 0;
                console.log(`📘 Marked messages as read for user ${userId}`);
            }
        });

        // Lấy lịch sử hội thoại
        socket.on("get_conversation", ({ userId }) => {
            const conversation = messageHistory[userId] || [];
            socket.emit("conversation_history", conversation);
            console.log(`📜 Sent conversation history for user ${userId}: ${conversation.length} messages`);
        });

        // Khi user hoặc admin disconnect
        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
            const roomId = userRooms[socket.id];
            
            // Nếu là user disconnect, xóa khỏi danh sách active
            if (roomId) {
                const userId = roomId.replace('user_', '');
                
                // Kiểm tra xem còn client nào trong room không
                const room = io.sockets.adapter.rooms.get(roomId);
                if (!room || room.size === 0) {
                    // Không xóa khỏi activeChats để duy trì lịch sử chat
                    // activeChats.delete(userId);
                    
                    // Đánh dấu user offline
                    userStatus[userId] = false;
                    
                    // Thông báo cho admin biết user đã offline
                    io.emit("user_status_update", { userId, online: false });
                    
                    console.log(`👋 User ${userId} is now offline`);
                }
            }
            
            delete userRooms[socket.id];
        });
    });

    return io;
}

module.exports = initSocket;
