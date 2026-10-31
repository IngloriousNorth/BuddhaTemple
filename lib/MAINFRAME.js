//MAINFRAME EXAMPLE
import flash from '../script/controllers/quantum_flash.js';
import quotationGraph from '../script/models/quotation_graph.js';


const MVC = {
    Model: {
        quotationGraph: quotationGraph,

    },
    View: {
    },
    Controller: {
        flash: flash,
    }
};

export default MVC;