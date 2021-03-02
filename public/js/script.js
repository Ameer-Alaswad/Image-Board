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
    },
    mounted: function () {
        var self = this;
        // console.log('self.images', self.images);
        axios
            .get('/images')
            .then(function (response) {
                self.images = response.data;
                let map = response.data.map((id) => {
                    return id.id;
                });
                console.log('map', map);
                let lowestId = Math.min.apply(null, map);
                console.log('lowestId', lowestId);
                axios.get('/render', lowestId);
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
    },
});
