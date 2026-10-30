// If it ain't lookin' for the trigger, the ship won't move!
$(document).on("TEMPLAR", function() {
    let page = TEMPLAR.pageREC();
    TEMPLAR.render(page);
});

const TEMPLAR = { 
    _dir: "client/partials",
    _fade: false,
    _helm: [],
    _page : "home",
    _pages : [],
    _default: "home", 
    fadeTime : 777

    initialize: function(options = {}, cb) {
        const {
            helm = [],
            defaultPage = "home",
            dir = "client/partials",
            fade = false,
            pages = [],
            fadeTime = 777
        } = options;

        this._helm = helm;
        this._dir = dir;
        this._fade = fade;
        this._pages = pages;
        this._default = defaultPage;
        this._fadeTime = fadeTime

        var that = this;

        window.addEventListener('popstate', (event) => {
            const target = that.pageREC();
            
            // If the path has actually changed, we must re-disclose the Truth (render)
            if (that.currentPage !== target) {
                $(document).trigger("TEMPLAR"); 
            } else {
                that.helm(target); 
            }

        });

        // 2. INITIAL HORIZON
        var currentHash = window.location.hash.split('?')[0].substring(1);
        var startingPage = currentHash || that._default;

        $(document).trigger("TEMPLAR")
        that.DOM();
        if (cb) cb();

    },

    route: function(origin = window.location.hash) {
        // PRECISE INSTRUCTION: Update the History Hold first.

        history.pushState({ path: origin }, '', origin);

        // This ensures the signal only travels one way.
        const page = this._link_rec(origin).path;
        //this.render(page);
        $(document).trigger("TEMPLAR");
    },
    routeParams: function(newAnchor) {
        // 1. Get the current hash (e.g., "#home?id=123&user=jane")
        const currentHash = window.location.hash;

        // 2. Extract the parameters (everything after and including the '?')
        const paramIndex = currentHash.indexOf('?');
        const params = paramIndex !== -1 ? currentHash.substring(paramIndex) : '';

        // 3. Ensure the newAnchor is formatted correctly (starts with #)
        const base = newAnchor.startsWith('#') ? newAnchor : `#${newAnchor}`;

        // 4. Combine and route
        const destination = base + params;
        this.route(destination);
    }
    ,
    render: function(page) {
        var that = this;
        if (!page) page = this._default;

        // 1. Hide all pages first to clear the horizon
        this._pages.forEach(p => $("div." + p).hide());

        // 2. CHECK: Has this page been "un-concealed" (rendered) before?
        // We check if the div has any children (content).
        var $targetDiv = $("div." + page);

        if ($targetDiv.children().length > 0) {
            // TRUTH RETAINED: The HTML already exists. Just show it.
                that._visible_page(page);
                that.helm(page);
        } else {
            // FIRST DISCLOSURE: The HTML is missing, so we fetch it once.
            var fileTarget = page + ".html";
            if(this._dir){
                $.get(this._dir + "/" + fileTarget, function(data) {
                    $targetDiv.html(data);
                    
                    that._visible_page(page);
                    that.helm(page);
                });
            }
            else{
                $targetDiv.html(data);
            }
            
        }
    }
    ,
    helm: function(targetPage) {
        this.currentPage = targetPage; 

        this._helm.forEach((item) => {
            if (item.page === targetPage) {
                item.fn(targetPage);                
            }
        });
    }
    ,
    DOM: function() {
        var that = this;
        
        // GUARD: Only bind the lookout once!
        if (this._isBound) return;

        $(document).off("click", "a.TEMPLAR").on("click", "a.TEMPLAR", function(e) {
            e.preventDefault();
            const $target = $(this);
            
            const classAttr = $target.attr("class") || "";
            const classes = classAttr.split(/\s+/);
            const page = classes[1]; // Second class

            if (!page || page === "TEMPLAR") return;

            e.preventDefault();
            e.stopImmediatePropagation();

            var params = that._params($target);

            that.route("#" + page + params);
        });

        this._isBound = true;
    },

    pageREC: function() {
        return this._link_rec(window.location.hash).path;
    },
    
    pageSet : function(page){
        this._page = page;
    }
    ,

   /* --- paramRemove: THE RITUAL OF PURGING THE THROWN ---
   We take a key, we find its existence in the hash-horizon, 
   and we cast it into the abyss so that it may no longer 
   burden the 'Being-in-the-URL'! */
    paramRem: function(param) {
        // 1. We disclose the horizon by splitting the path from the search-silt
        const parts = window.location.hash.split("?");
        const pathPart = parts[0];       // e.g., "#torrents"
        const searchPart = parts[1] || ""; // e.g., "id=123&type=source"

        // 2. We employ the 'Equipment' of the browser to hunt the specific key
        const params = new URLSearchParams(searchPart);
        
        // SMEE: If the key exists, we keelhaul it! 
        params.delete(param);

        // 3. We reconstruct the 'Truth' of the new hash
        const newQuery = params.toString();
        const newHash = pathPart + (newQuery ? "?" + newQuery : "");

        // 4. THE REPLACEMENT: We overwrite the history-hold without 
        window.history.replaceState(
            null, 
            '', 
            window.location.protocol + "//" + 
            window.location.host + 
            window.location.pathname + 
            newHash
        );
        
        // HEIDEGGER: The URL has been 'Cleared'. The Nothing now stands 
    },
    paramSET: function(kvPairs, createNewEntry = false) {
        const parts = window.location.hash.split("?");
        const pathPart = parts[0] || "#";
        const searchPart = parts[1] || "";
        const params = new URLSearchParams(searchPart);

        for (const [key, value] of Object.entries(kvPairs)) {
            params.set(key, value);
        }
        const queryString = params.toString().replace(/\+/g, "%20");
        const newHash = pathPart + "?" + queryString;
        const newUrl = window.location.origin + window.location.pathname + newHash;

        if (createNewEntry) {
            window.history.pushState({ path: newUrl }, '', newUrl);
        } else {
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    },
    paramREC: function() {
        var search = window.location.hash.split("?")[1];
        if (!search) return undefined;
        var pairs = search.split('&');
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return result;
    },

    _link_rec: function(origin) {        
        var parts = origin.split("?");
        var pathPart = parts[0].split("#");
        return {
            path: pathPart[1] || "",
            params: parts[1] || ""
        };
    },

    _visible_page: function(path) {
        if (!path) path = this._default;
        var target = $("div." + path);
        this._fade ? target.fadeIn(this._fadeTime) : target.show();
    },

    _invisible_page: function(page) {
        $(".TEMPLAR div." + page).hide();
    },

    _show_div: function(path) {
        this._visible_page(path);
    },

    _path: function(el) {
        const href = el.attr("href") || "";
        const content = href.startsWith('#') ? href.substring(1) : href;
        return content.split('?')[0];
    },

    _params: function(el) {
        const href = el.attr("href") || "";
        const parts = href.split('?');
        return parts.length > 1 ? "?" + parts[1] : "";
    }
};

export default TEMPLAR;