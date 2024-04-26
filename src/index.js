
import dva from 'dva';
import './index.css';
if (typeof (StaticHost) != 'undefined'&&typeof (StaticVer) != 'undefined'&&StaticHost&&StaticVer) {
  __webpack_public_path__ = "//" + StaticHost + '/course/' + StaticVer + '/';
  
}
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
