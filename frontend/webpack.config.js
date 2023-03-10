const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	mode: "development",

	// メインとなるJavaScriptファイル（エントリーポイント）
	entry: "./src/index.ts",
	// ファイルの出力設定
	output: {
		//  出力ファイルのディレクトリ名
		path: `${__dirname}/dist`,
		// 出力ファイル名
		filename: "main.js"
	},
	plugins: [new HtmlWebpackPlugin({
		//テンプレートに使用するhtmlファイルを指定
		template: './src/index.html'
	}), new MonacoWebpackPlugin()],
	module: {
		rules: [
			{
				// 拡張子 .ts の場合
				test: /\.ts$/,
				// TypeScript をコンパイルする
				use: "ts-loader"
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	// import 文で .ts ファイルを解決するため
	resolve: {
		extensions: [".ts", ".js"]
	}
};