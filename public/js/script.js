// const { AlexaForBusiness } = require('aws-sdk');

console.log('klab');
new Vue({
    el: '#main',
    data: {
        name: 'fennel',
        images: [],
    },
    mounted: function () {
        console.log('my main vue is ready');
        // console.log('this.cities', this.cities);
        var self = this;
        axios
            .get('/images')
            .then((response) => {
                console.log('response', response.data);
                self.images = response.data;
            })
            .catch((err) => console.log('err is get cities'));
    },
});
