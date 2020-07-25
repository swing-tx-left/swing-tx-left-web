const path = require('path');

module.exports = {
	entry: './public/admin/widgets.jsx',
	output: {
		filename: 'widgets.js',
		path: path.resolve('./', 'public/admin/dist'),
		libraryTarget: 'window',
		library: 'CMSWIDGETS',
	},
	module: {
		rules: [
			{

				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ['@babel/preset-react'],
					plugins: []
				}

			}
		]
	}
}