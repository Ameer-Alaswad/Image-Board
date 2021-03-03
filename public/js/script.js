// const { SimpleDB } = require('aws-sdk');

Vue.component('comments-component', {
    template: '#comments-component',
    data: function () {
        return {
            comments: [],
            username: '',
            comment: '',
        };
    },
    props: ['imageId'],
    mounted: function () {
        var self = this;
        console.log('this.id', self.imageId);
        axios
            .get('/comments/' + self.imageId)
            .then((response) => {
                console.log('response.data', response.data);
                console.log('response', response.data);
                self.comments = response.data;
                console.log('comments', self.comments);
            })
            .catch((err) => console.log('err in mounted get comments ', err));
    },
    methods: {
        postComment: function (e) {
            var self = this;
            console.log('comment', self.comment);
            console.log('self.isername', self.username);
            console.log('self.imageid', self.imageId);
            var commentInfos = {
                comment: self.comment,
                username: self.username,
                image_id: self.imageId,
            };
            console.log('commentInfos', 'ameer');
            axios.post('/comment', commentInfos).then((response) => {
                console.log('response', response.data.comment);
                self.comments.unshift(response.data.comment);
                self.comment = '';
                self.username = '';
                console.log('self.comments', self.comments);
            });
        },
    },
});

Vue.component('first-component', {
    template: '#first-component',
    data: function () {
        return {
            image: {},
        };
    },
    props: ['imageId'],
    mounted: function () {
        var self = this;
        console.log('this.id', self.imageId);
        axios.get('/image/' + self.imageId).then((response) => {
            self.image = response.data[0];
        });
    },
    methods: {
        closeImage: function () {
            console.log(
                'hey component here, I want the main vue instance to know it should do sth!'
            );
            this.$emit('close');
        },
    },
});

new Vue({
    el: '#main',
    data: {
        images: [],
        title: '',
        username: '',
        description: '',
        file: null,
        imageId: null,
        thereAreImages: true,
    },
    mounted: function () {
        var self = this;
        // console.log('self.images', self.images);
        axios
            .get('/images')
            .then(function (response) {
                self.images = response.data;
                // let map = response.data.map((id) => {
                //     return id.id;
                // });
                // console.log('map', map);
                // let lowestId = Math.min.apply(null, map);
                // console.log('lowestId', lowestId);
                // axios.get('/render', lowestId)
            })
            .catch(function (err) {
                console.log('error in axios', err);
            });
    },
    methods: {
        clickedImage: function (e) {
            var self = this;
            console.log('e.target', e.target.id);
            self.imageId = e.target.id;
            console.log('image', self.imageId);
        },

        handleClick: function (e) {
            // e.preventDefault()
            var self = this;
            var formData = new FormData();
            formData.append('title', this.title);
            formData.append('description', this.description);
            formData.append('username', this.username);
            formData.append('file', this.file);
            axios
                .post('/upload', formData)
                .then(function (response) {
                    console.log(
                        'response from post req: ',
                        response.data.image
                    );
                    self.images.unshift(response.data.image);
                    console.log('self.images', self.images);
                })
                .catch(function (err) {
                    console.log('error from post req', err);
                });
        },

        handleChange: function (e) {
            console.log('e.target.files[0]: ', e.target.files[0]);
            console.log('handle change is running!');
            this.file = e.target.files[0];
        },
        closeComponent: function () {
            var self = this;
            self.imageId = null;
        },
        getMoreImages: function (e) {
            var self = this;
            console.log('images', self.images);
            // let map = self.images.map((id) => {
            //     return id.id;
            // });
            // console.log('map', map);
            // let lowestId = Math.min.apply(null, map);
            // console.log('lowestId', lowestId);
            const lowestId = this.images[this.images.length - 1].id;
            console.log('lowestIdd', lowestId);
            axios.get('/more/' + lowestId).then((response) => {
                console.log('response', response.data[0]);
                self.images.push(...response.data);
                if (this.images[this.images.length - 1].id == lowestId) {
                    return (self.thereAreImages = false);
                }
            });
        },
    },
});
