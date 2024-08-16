// server with Express
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const multer = require('multer');
const { createClient } = require("redis")
const server = require('http').createServer(app);
const fs = require('fs');
const { Server } = require("socket.io");

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const upload = multer({ dest: 'uploads/' });
const client = createClient({
    url: "rediss://default:AYa3AAIjcDE0OGQ3NTgyOGIyMDQ0NzQ5OTgzYmQwYTM2NGIyMjMwN3AxMA@just-shepherd-34487.upstash.io:6379"
});
client.connect()

// socket io logics here
let users = {};
io.on('connection', (socket) => {

    socket.on('register', (userId) => {
        users[userId] = socket.id;
        console.log(userId + " registered as " + users[userId]);
    });

    app.get('/api/get_messages', (req, res) => {
        const title = req.query.title;
        const user = req.query.user;
        client.get('messages').then(messages => {
            if (messages) {
                res.json({ status: 200, messages: JSON.parse(messages).find(m => m.user.username === user && m.hotel.title === title) });
            } else {
                res.json({ status: 404, message: 'No messages found!' });
            }
        })
    })

    // api endpoints to get inbox for user
    app.get('/api/get_all_inbox', async (req, res) => {
        client.get('messages').then(messages => {
            if (messages) {
                res.json({ status: 200, messages: JSON.parse(messages) });
            } else {
                res.json({ status: 404, message: 'No messages found!' });
            }
        })
    })

    // api endpoints to get inbox for user
    app.get('/api/get_inbox', async (req, res) => {
        const user = req.query.user;
        client.get('messages').then(messages => {
            if (messages) {
                res.json({ status: 200, messages: JSON.parse(messages).filter(m => m.user?.username === user) });
            } else {
                res.json({ status: 404, message: 'No messages found!' });
            }
        })
    })

    // api endpoints to set messages as user
    app.post('/api/set_message', upload.none(), async (req, res) => {
        const msg = req.body;
        let reciever;
        client.get('messages').then(async messages => {
            if (messages) {
                allMsg = JSON.parse(messages);
                const userMessages = allMsg.find(m => m.user?.username === msg.user.username && m.hotel.title === msg.hotel.title);

                if (userMessages) {
                    userMessages.messages.unshift(msg.messages[0]);  // Add the new message to the existing user's hotel conversation
                } else {
                    allMsg.push(msg);  // If no existing conversation, add the new message as a new conversation
                }
            } else {
                allMsg.push(msg);  // If no messages exist, create the first one
            }

            return await client.set('messages', JSON.stringify(allMsg));
        }).then(() => {
            if (msg.messages[0].sender === 'admin') {
                io.to(users[msg.user.username]).emit('receive_message');
                console.log("emitting message to " + msg.user.username + " with id: " + users[msg.user.username]);
            } else {
                io.to(users['admin']).emit('receive_message');
                console.log("emitting message to admin, id = " + users['admin']);
            }
            res.json({ status: 200, message: 'Message sent successfully!' });
        }).catch(err => {
            res.json({ status: 500, message: 'Error sending message', error: err });
        });

    })

    // api endpoints to get all reviews
    app.get('/api/get_reviews', async (req, res) => {
        client.get('reviews').then(reviews => {
            if (reviews) {
                res.json({ status: 200, reviews: JSON.parse(reviews) });
            } else {
                res.json({ status: 404, message: 'No reviews found!' });
            }
        });
    })

    // api endpoints to add review
    app.post('/api/add_review', upload.none(), async (req, res) => {
        const { title, bookingType, rating, review, name, src } = req.body;
        const newReview = { title, bookingType, rating, review, name, src };
        newReview.date = new Date().toLocaleDateString('en-US', {
            weekday: 'short', // "Wed"
            year: 'numeric',  // "2024"
            month: 'short',   // "Aug"
            day: 'numeric'    // "14"
        });
        client.get('reviews').then(oldReviews => {
            let newReviews = [];
            if (oldReviews) {
                newReviews = JSON.parse(oldReviews);
                newReview.id = newReviews.length > 0 ? newReviews[0].id + 1 : 1;  // Assign a new ID
            } else {
                newReview.id = 1;  // First review ID
            }

            newReviews.unshift(newReview);  // Add the new review to the beginning

            client.set('reviews', JSON.stringify(newReviews)).then(() => {
                client.get('bookings').then(oldBookings => {
                    if (oldBookings) {
                        const bookings = JSON.parse(oldBookings);
                        const updatedBookings = bookings.map(booking => {
                            if (booking.title.toLowerCase() === title.toLowerCase()) {
                                booking.reviewed = true;  // Set reviewed to true for matching bookings
                            }
                            return booking;  // Return the updated booking
                        });

                        client.set('bookings', JSON.stringify(updatedBookings)).then(() => {
                            res.json({ status: 200, message: 'Review added successfully and booking updated!' });
                        }).catch(err => {
                            res.json({ status: 500, message: 'Error updating bookings', error: err });
                        });

                    } else {
                        res.json({ status: 404, message: 'No bookings found!' });
                    }
                }).catch(err => {
                    res.json({ status: 500, message: 'Error retrieving bookings', error: err });
                });
            }).catch(err => {
                res.json({ status: 500, message: 'Error saving reviews', error: err });
            });
        }).catch(err => {
            res.json({ status: 500, message: 'Error retrieving reviews', error: err });
        });
    })

    // api endpoints to confirm booking confirmation
    app.post('/api/confirm_booking', upload.none(), async (req, res) => {
        const bookingId = req.body.bookingId;
        client.get('bookings').then(oldBookings => {
            if (oldBookings) {
                const newBookings = JSON.parse(oldBookings).map(booking => {
                    if (booking.id === bookingId) {
                        booking.status = 'confirmed';
                    }
                    return booking;
                });
                client.set('bookings', JSON.stringify(newBookings));
                res.json({ status: 200, message: 'Booking confirmed successfully!' });
            } else {
                res.json({ status: 400, message: 'Booking not found!' });
            }
        });
    })

    // api endpoints to get all bookings
    app.get('/api/get_all_bookings', async (req, res) => {
        let bookings = await client.get('bookings');
        if (bookings) {
            bookings = JSON.parse(bookings);
            res.json(bookings);
        };
    })

    // api endpoints to get bookings by username
    app.get('/api/get_bookings', async (req, res) => {
        const username = req.query.username;
        let bookings = await client.get('bookings');
        if (bookings) {
            bookings = JSON.parse(bookings);
            res.json(bookings.filter(booking => booking.user === username));
        } else {
            res.json([]);
        }
    })

    // api endpoints to set book
    app.post('/api/set_booking', upload.none(), async (req, res) => {
        const booking = req.body;
        booking.status = 'pending';
        client.get('bookings').then(oldBookings => {
            if (oldBookings) {
                booking.id = JSON.parse(oldBookings)[0].id + 1;
                const newBookings = [booking, ...JSON.parse(oldBookings)];
                client.set('bookings', JSON.stringify(newBookings));
            } else {
                booking.id = 1;
                client.set('bookings', JSON.stringify([booking]));
            }
            res.json({ status: 200, message: booking.bookingType + ' booked successfully!' });
        });
    })

    // api endpoints to sign up user
    app.post('/api/signup', upload.single('image'), async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const users = await client.get('users');
            if (users && JSON.parse(users).find(user => user.email === email)) {
                return res.json({ status: 400, message: 'Email already exists' });
            } else if (users && JSON.parse(users).find(user => user.username === username)) {
                return res.json({ status: 400, message: 'Username already exists' });
            } else {
                if (req.file) {
                    req.body.image = `uploads/users/${username}.png`;
                    fs.renameSync(req.file.path, req.body.image);
                } else {
                    req.body.image = 'uploads/users/default_user.png';
                }
                let newUsers = [];
                if (users) {
                    newUsers = JSON.parse(users);
                }
                req.body.role = 'user';
                newUsers.push(req.body);
                client.set('users', JSON.stringify(newUsers)).then(() => {
                    delete req.body.password;
                    res.json({ status: 200, user: req.body });
                });
            }
        } catch (error) {
            console.log(error);
            res.json({ status: 400, message: 'Error creating user ' + error.message });
        }
    });

    // api endpoints to signin
    app.post('/api/signin', upload.none(), async (req, res) => {
        try {
            const { user, password } = req.body;
            // compare username or email and password with stored data
            const users = await client.get('users');
            if (!users) {
                return res.json({ status: 401, message: 'Invalid credentials' });
            }
            const userObj = JSON.parse(users).find(use => use.email === user || use.username === user);
            if (!userObj || userObj.password !== password) {
                return res.json({ status: 401, message: 'Invalid credentials' });
            }
            delete userObj.password;
            res.json({ status: 200, user: userObj });
        } catch (error) {
            console.log(error);
            res.json({ status: 500, message: 'Error logging in' });
        }
    });

    // api endpoints to get place data
    app.get('/api/get_places', async (req, res) => {
        try {
            const data = await client.get('places');
            res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            console.log(error);
        }
    });

    // api endpoints to set place data
    app.post('/api/set_place', upload.single("src"), async (req, res) => {
        const data = req.body;
        data.src = `uploads/places/${data.title}.png`;
        const oldData = await client.get(`places`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        if (newData.some(place => place.title === data.title)) {
            return res.json({ status: 400, message: 'Title must be unique' });
        }
        data.id = newData[0].id + 1;
        client.set(`places`, JSON.stringify([data, ...newData])).then(() => {
            fs.renameSync(req.file.path, data.src);
            res.json({ status: 200, message: 'Data saved successfully!' });
        }).catch(err => {
            console.error(err);
            res.json({ status: 500, message: 'Error saving data' });
        });
    });

    // api endpoints to delete place data
    app.delete('/api/delete_place/:title', async (req, res) => {
        const title = req.params.title;
        const oldData = await client.get(`places`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        const placeToDelete = newData.find(place => place.title === title);
        if (placeToDelete.title) {
            fs.unlinkSync(placeToDelete.src);
            newData = newData.filter(place => place.title !== title);
            client.set(`places`, JSON.stringify(newData)).then(() => {
                res.json({ message: 'Data deleted successfully!' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Error deleting data' });
            });
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    });

    // api endpoints to set transposition data
    app.post('/api/set_transport', upload.none(), async (req, res) => {
        const data = req.body;
        try {
            const oldData = await client.get(`transports`)
            let newData = oldData ? JSON.parse(oldData) : [];
            newData = [data, ...newData];
            client.set(`transports`, JSON.stringify(newData)).then(() => {
                res.json({ status: 200, message: 'Data saved successfully!' });
            }).catch(err => {
                console.error(err);
                res.json({ status: 500, message: 'Error saving data' });
            });
        } catch (error) {
            res.json({ status: 500, message: 'Error getting data' });
        }
    });

    // api endpoints to get transposition data
    app.get('/api/get_transports', async (req, res) => {
        try {
            const data = await client.get('transports');
            res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            console.log(error);
        }
    });

    // api endpoints to delete transport data
    app.delete('/api/delete_transport/:vehicleNumber', async (req, res) => {
        const vehicleNumber = req.params.vehicleNumber;
        client.get(`transports`).then(async (oldData) => {
            let newData = oldData ? JSON.parse(oldData) : [];
            const transportToDelete = newData.find(transport => transport.vehicleNumber === vehicleNumber);
            if (transportToDelete) {
                newData = newData.filter(transport => transport.vehicleNumber !== vehicleNumber);
                client.set(`transports`, JSON.stringify(newData)).then(() => {
                    res.json({ message: 'Data deleted successfully!' });
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'Error deleting data' });
                });
            } else {
                res.status(404).json({
                    message: 'Transport not found'
                })
            }
        }).catch(err => res.status(500).json({ message: 'Error getting data' }));
    });

    // api endpoints to set blog data
    app.post('/api/set_blog', upload.single('image'), async (req, res) => {
        const data = req.body;
        data.image = `uploads/blogs/${data.title}.png`;
        try {
            const oldData = await client.get(`blogs`)
            let newData = oldData ? JSON.parse(oldData) : [];
            if (newData.some(blog => blog.title === data.title)) {
                return res.json({ status: 400, message: 'Title must be unique' });
            }
            newData = [data, ...newData];
            client.set(`blogs`, JSON.stringify(newData)).then(() => {
                fs.renameSync(req.file.path, data.image);
                res.json({ status: 200, message: 'Data saved successfully!' });
            }).catch(err => {
                console.error(err);
                res.json({ status: 500, message: 'Error saving data' });
            });
        } catch (error) {
            res.json({ status: 500, message: 'Error getting data' });
        }
    });

    // api endpoints to get blog data by title
    app.get('/api/get_blog/:title', async (req, res) => {
        const title = req.params.title;
        try {
            const data = await client.get(`blogs`);
            const blog = JSON.parse(data).find(blog => blog.title === title);
            if (blog) {
                res.json(blog);
            } else {
                res.status(404).json({
                    message: 'Blog not found'
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error getting data' });
        }
    });

    // api endpoints to get blog data
    app.get('/api/get_blogs', async (req, res) => {
        try {
            const data = await client.get('blogs');
            res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            console.log(error);
        }
    });

    // api endpoints to delete blog data
    app.delete('/api/delete_blog/:title', async (req, res) => {
        const title = req.params.title;
        client.get(`blogs`).then(async (oldData) => {
            let newData = oldData ? JSON.parse(oldData) : [];
            const blogToDelete = newData.find(blog => blog.title === title);
            if (blogToDelete) {
                newData = newData.filter(blog => blog.title !== title);
                client.set(`blogs`, JSON.stringify(newData)).then(() => {
                    fs.unlinkSync(blogToDelete.image);
                    res.json({ message: 'Data deleted successfully!' });
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'Error deleting data' });
                });
            } else {
                res.status(404).json({
                    message: 'Blog not found'
                })
            }
        }).catch(err => res.status(500).json({ message: 'Error getting data' }));
    })

    // api endpoints to get hotel data
    app.get('/api/get_hotels', async (req, res) => {
        try {
            const data = await client.get('hotels');
            res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            console.log(error);
        }
    });

    // api endpoints to set hotel data
    app.post('/api/set_hotel', upload.single("src"), async (req, res) => {
        const data = req.body;
        data.src = `uploads/hotels/${data.title}.png`;
        const oldData = await client.get(`hotels`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        if (newData.some(hotel => hotel.title === data.title)) {
            return res.json({ status: 400, message: 'Title must be unique' });
        }
        client.set(`hotels`, JSON.stringify([data, ...newData])).then(() => {
            fs.renameSync(req.file.path, data.src);
            res.json({ status: 200, message: 'Data saved successfully!' });
        }).catch(err => {
            console.error(err);
            res.json({ status: 500, message: 'Error saving data' });
        });
    });

    // api endpoints to delete hotel data
    app.delete('/api/delete_hotel/:title', async (req, res) => {
        const title = req.params.title;
        const oldData = await client.get(`hotels`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        const hotelToDelete = newData.find(hotel => hotel.title === title);
        if (hotelToDelete.title) {
            fs.unlinkSync(hotelToDelete.src);
            newData = newData.filter(hotel => hotel.title !== title);
            client.set(`hotels`, JSON.stringify(newData)).then(() => {
                res.json({ message: 'Data deleted successfully!' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Error deleting data' });
            });
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    });

    // api endpoints to get package data
    app.get('/api/get_packages', async (req, res) => {
        try {
            const data = await client.get('packages');
            res.json(data ? JSON.parse(data) : []);
        } catch (error) {
            console.log(error);
        }
    });

    // api endpoints to set package data
    app.post('/api/set_package', upload.single("src"), async (req, res) => {
        const data = req.body;
        data.type = req.body.type[0];
        data.src = `uploads/packages/${data.title}.png`;
        const oldData = await client.get(`packages`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        if (newData.some(package => package.title === data.title)) {
            return res.json({ status: 400, message: 'Title must be unique' });
        }
        client.set(`packages`, JSON.stringify([data, ...newData])).then(() => {
            fs.renameSync(req.file.path, data.src);
            res.json({ status: 200, message: 'Data saved successfully!' });
        }).catch(err => {
            console.error(err);
            res.json({ status: 500, message: 'Error saving data' });
        });
    });

    // api endpoints to delete hotel data
    app.delete('/api/delete_package/:title', async (req, res) => {
        const title = req.params.title;
        const oldData = await client.get(`packages`);
        let newData = [];
        if (oldData) {
            newData = JSON.parse(oldData);
        }
        const hotelToDelete = newData.find(hotel => hotel.title === title);
        if (hotelToDelete.title) {
            newData = newData.filter(hotel => hotel.title !== title);
            client.set(`packages`, JSON.stringify(newData)).then(() => {
                try {
                    fs.unlinkSync(hotelToDelete.src);
                } catch (error) {
                    console.log(error.message);
                }
                res.json({ message: 'Data deleted successfully!' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Error deleting data' });
            });
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Find and remove the user from the users object
        for (const [userId, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userId];
                console.log(`User ${userId} removed from users`);
                break;
            }
        }
    });

}) // socket logic ends here

// app.listen(port, () => console.log(`Server running on port ${port}`));
server.listen(port, () => console.log(`Server running on port ${port}`));


