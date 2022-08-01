const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 5000;
const config = require('./server/config/key');
const { Post } = require('./server/Model/Post');
const { Counter } = require('./server/Model/Counter');
const { User } = require('./server/Model/User');
const { Comment } = require('./server/Model/Comment');

app.use(express.static(path.join(__dirname, './client/build')));
app.use('/img', express.static('./img'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(config.mongoURI)
.then(() => {
    console.log('MongoDB connected...');
}).catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.post('/api/post/submit', (req, res) => {
    let temp = {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
    };
    Counter.findOne({name: 'counter'}).exec().then((counter) => {
        temp.postNum = counter.postNum;
        User.findOne({uid: req.body.uid}).exec().then((userInfo) => {
            temp.author = userInfo._id;
            const post = new Post(temp);
            post.save().then(() => {
                Counter.updateOne({name: 'counter'}, {$inc: {postNum: 1}}).then(() => {
                    res.status(200).json({success: true});
                });
            });
        });
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/post/list', (req, res) => {
    Post.find({$or: [{title: {$regex: req.body.search}}, {content: {$regex: req.body.search}}]}).populate('author').exec().then((list) => {
        res.status(200).json({
            success: true,
            list: list
        });
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/post/detail', (req, res) => {
    Post.findOne({postNum: req.body.postNum}).populate('author').exec().then((detail) => {
        res.status(200).json({
            success: true,
            detail: detail
        });
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/post/edit', (req, res) => {
    let temp = {
        title: req.body.title,
        content: req.body.content
    }
    Post.updateOne({postNum: req.body.postNum}, {$set: temp}).exec().then(() => {
        res.status(200).json({success: true});
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/post/delete', (req, res) => {
    Post.findOne({postNum: req.body.postNum}).exec().then((post) => {
        Comment.deleteMany({postId: post._id}).exec().then(() => {
            Post.deleteOne({postNum: post.postNum}).exec().then(() => {
                res.status(200).json({success: true});
            });
        });
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'img/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage}).single('file');

app.post('/api/post/image/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            res.status(400).json({success: false});
        } else {
            res.status(200).json({
                success: true,
                filePath: res.req.file.path
            });
        }
    });
});

app.post('/api/user/register', (req, res) => {
    let temp = req.body;
    Counter.findOne({name: 'counter'}).then((counter) => {
        temp.userNum = counter.userNum;
        const user = new User(req.body);
        user.save().then(() => {
            Counter.updateOne({name: 'counter'}, {$inc: {userNum: 1}}).then(() => {
                res.status(200).json({success: true});
            });
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).json({success: false});
    });
});

app.post('/api/user/nameCheck', (req, res) => {
    User.findOne({displayName: req.body.displayName}).exec().then((name) => {
        let check = true;
        if (name) {
            check = false;
        }
        res.status(200).json({
            success: true,
            check: check,
        });
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/user/emailCheck', (req, res) => {
    User.findOne({email: req.body.email}).exec().then((email) => {
        if (email) {
            res.status(200).json({success: true});
        } else {
            res.status(400).json({success: false});    
        }
    }).catch((err) => {
        res.status(400).json({success: false});
    });
});

app.post('/api/comment/submit', (req, res) => {
    let temp = {
        comment: req.body.comment,
        postId: req.body.postId,
    };
    User.findOne({uid: req.body.uid}).exec().then((userInfo) => {
        temp.author = userInfo._id;
        const comment = new Comment(temp);
        comment.save().then(() => {
            return res.status(200).json({success: true});  
        });
    }).catch((err) => {
        return res.status(400).json({success: false});
    });
});

app.post('/api/comment/getComments', (req, res) => {
    Comment.find({postId: req.body.postId}).populate('author').exec().then((comments) => {
        return res.status(200).json({
            success: true,
            commentList: comments,
        });
    }).catch((err) => {
        return res.status(400).json({success: false});
    });
});

app.post('/api/comment/edit', (req, res) => {
    let temp = {
        postId: req.body.postId,
        comment: req.body.comment,
        uid: req.body.uid,
    }
    Comment.findOneAndUpdate({_id: req.body.commentId}, {$set: temp}).exec().then(() => {
        return res.status(200).json({success: true});
    }).catch((err) => {
        return res.status(400).json({success: false});
    });
});

app.post('/api/comment/delete', (req, res) => {
    Comment.deleteOne({_id: req.body.commentId}).exec().then(() => {
        return res.status(200).json({success: true});
    }).catch((err) => {
        return res.status(400).json({success: false});
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});