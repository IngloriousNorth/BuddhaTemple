//MAINFRAME EXAMPLE
import flashCard from '/..script/controllers/flash_card';
import realTimeSearch from '../script/controllers/realtime_search';
import quotationGrpah from '../script/models/quotation_graph';

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