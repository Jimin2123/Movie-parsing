const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry:{
        app: path.join(__dirname, 'src/app.js')
    },
    output:{
        filename: '[name].js',
        path: path.join(__dirname, 'public')
    },
    module:{
        rules:[
            {
                test: /\.css$/,   // .css로 끝나는 것을 정규식으로 거름
                use:['style-loader', 'css-loader']
            },
            {
                test:/\.vue$/, //.vue로 끝나는 것들
                loader:'vue-loader'
            }
        ]
    },
    resolve: {
        alias: {
            "vue$":"vue/dist/vue.esm.js",
            "@":path.join(__dirname, 'src/'),
            "@item":path.join(__dirname,'src/components/items'),
            "@view":path.join(__dirname,'src/components/views'),
        },
        extensions:['*', '.js', '.vue', '.json']
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}