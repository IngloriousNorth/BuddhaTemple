//MAINFRAME EXAMPLE
import quotations from '../script/controllers/quotations.js';
import flashCard from '../script/controllers/flash_card.js';
import realTimeSearch from '../script/controllers/realtime_search.js';
import quotationGraph from '../script/models/quotation_graph.js';
import homeV from '../script/views/home.js'
import menuV from '../script/views/menu.js'//the bug is here
import home from '../script/models/home.js'
import menu from '../script/models/menu.js'

const MVC = {
    Model: {
        quotationGraph: quotationGraph,
        home : home,
        menu : menu

    },
    View: {
        homeV : homeV,
        menuV : menuV
    },
    Controller: {
        quotations : quotations,
        flashCard: flashCard,
        realTimeSearch: realTimeSearch,
    }
};

export default MVC;