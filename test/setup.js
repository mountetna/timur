
// suppresses a specific React warning (comment raf out to bring it back)
const raf = global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
