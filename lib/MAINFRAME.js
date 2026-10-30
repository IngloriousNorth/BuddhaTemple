//MAINFRAME EXAMPLE
import flashCard from '../script/controllers/flash_card.js';
import realTimeSearch from '../script/controllers/realtime_search.js';
import quotationGraph from '../script/models/quotation_graph.js';

const MVC = {
    Model: {
        quotationGraph: quotationGraph
    },
    View: {
    },
    Controller: {
        flashCard: flashCard,
        realTimeSearch: realTimeSearch,
    }
};

export default MVC;