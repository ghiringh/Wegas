/**
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */

YUI.add('wegas-datasourcerest', function(Y) {
	 
    var Lang = Y.Lang,
    
    DataSourceREST = function() {
	DataSourceREST.superclass.constructor.apply(this, arguments);
    };

    Y.mix(DataSourceREST, {
	NS: "rest",
	NAME: "DataSourceREST"
    });

    Y.extend(DataSourceREST, Y.Plugin.Base, {
	
	_data: [],
	
	initializer: function(config) {
	    //this.doBefore("_defRequestFn", this._beforeDefRequestFn);
	    this.doBefore("_defResponseFn", this._beforeDefResponseFn, this);
	    this.get('host').data = [];
	},
	_beforeDefRequestFn: function(e) {
	},
	_beforeDefResponseFn: function(e) {
	    var data = this.get('host').data;
    	    if (e.response.results[1] && e.response.results[1].errors) {
		var errorMsg = "";
	    
		for (var i = 0; i<e.response.results.length;i++) {
		    if (e.response.results[i].errors){
			for (var j=0; j<e.response.results[i].errors.length;j++) {
			    errorMsg += e.response.results[i].errors[j];
			}
		    }
		}
		alert(errorMsg);
	    } else {
		for (var i=0;i<e.response.results.length;i++) {
		    var loaded = false;
		   /* data = Y.Array.filter(this._data, function(o){
			return !(o.id == e.response.results[i].id);
		    }, this);
		    */
		    Y.Array.each(data, function(o, index, a) {
			if (o.id == e.response.results[i].id) {
			    a[index] = Y.merge(o, e.response.results[i]);
			    loaded = true
			}
		    });
		    if (!loaded) data.push(e.response.results[i]);
		}
		//this._data = this._data.concat(e.response.results);
	    }
	    
	    e.response.results = data;
	},
	getById: function(id) {  
	    var host = this.get('host');
	    
	    host.sendRequest({
		request: "/"+id,
		cfg: {
		    headers: {
			'Content-Type': 'application/json; charset=utf-8'
		    }
		},
		callback: {
		    success: this._successHandler,
		    failure: this._failureHandler
		}
	    });
	    
	},
	post: function(data) {
	    var host = this.get('host');
	    
	    host.sendRequest({
		//request: (data.id)?"/"+data.id:"",
		cfg: {
		    method: "POST",
		    headers: {
			'Content-Type': 'application/json; charset=utf-8'
		    },
		    data: Y.JSON.stringify(data)
		},
		callback: {
		    success: this._successHandler,
		    failure: this._failureHandler
		}
	    });
	},
	_successHandler: function(e){
	//console.log("Datasource reply:", e.response);
	//data = Y.JSON.stringify(e.response, null, 2);
	// host.sendRequest('/');
	},
	_failureHandler: function(e){
	    //alert("Error sending REST post request!");
	    var errorMsg = "";
	    
	    if (e.response.results) {
		for (var i = 0; i<e.response.results.length;i++) {
		    if (e.response.results[i].errors){
			for (var j=0; j<e.response.results[i].errors.length;j++) {
			    errorMsg += e.response.results[i].errors[j];
			//   e.response.results[i].errors = null;
			}
		    }
		}
		alert(errorMsg);
	    } else if (e.error) alert(e.error.message);
	},
	put: function(data) {
	    var host = this.get('host');
	    
	    host.sendRequest({
		request: (data.id)?"/"+data.id:"",
		cfg: {
		    method: "PUT",
		    headers: {
			'Content-Type': 'application/json; charset=utf-8'
		    },
		    data: Y.JSON.stringify(data)
		},
		callback: {
		    success: this._successHandler,
		    failure: this._failureHandler
		}
	    });
	}
    });
    
    Y.namespace('Plugin').DataSourceREST = DataSourceREST;
    
    	
    /** 
 * FIXME We redefine this so we can use a "." selector and a "@..." field name
 */
    Y.DataSchema.JSON.getPath = function(locator) {
	var path = null,
	keys = [],
	i = 0;

	if (locator) {
	    if (locator == '.') return [];					// MODIFIED !!
		    
	    // Strip the ["string keys"] and [1] array indexes
	    locator = locator.
	    replace(/\[(['"])(.*?)\1\]/g,
		function (x,$1,$2) {
		    keys[i]=$2;
		    return '.@'+(i++);
		}).
	    replace(/\[(\d+)\]/g,
		function (x,$1) {
		    keys[i]=parseInt($1,10)|0;
		    return '.@'+(i++);
		}).
	    replace(/^\./,''); // remove leading dot

	    // Validate against problematic characters.
	    if (!/[^\w\.\$@]/.test(locator)) {
		path = locator.split('.');
		for (i=path.length-1; i >= 0; --i) {
		/*if (path[i].charAt(0) === '@') {				// MODIFIED !!
			path[i] = keys[parseInt(path[i].substr(1),10)];
		    }*/
		}
	    }
	    else {
	}
	}
	return path;
    }
    Y.DataSource.IO.prototype._defRequestFn = function(e) {
	var uri = this.get("source"),
	io = this.get("io"),
	defIOConfig = this.get("ioConfig"),
	request = e.request,
	cfg = Y.merge(defIOConfig, e.cfg, {
	    on: Y.merge(defIOConfig, {
		success: this.successHandler,
		failure: this.failureHandler
	    }),
	    context: this,
	    "arguments": e
	});
        
	// Support for POST transactions
	if(Y.Lang.isString(request)) {
	    //if(cfg.method && (cfg.method.toUpperCase() === "POST")) {
	    //    cfg.data = cfg.data ? cfg.data+request : request;
	    //}
	    //else {
	    uri += request;
	//}
	}
	Y.DataSource.Local.transactions[e.tId] = io(uri, cfg);
	return e.tId;
    }
    
    // FIXME we rewrite this function, needs to be overriden
    Y.DataSchema.JSON._parseResults = function(schema, json_in, data_out) {
	var results = [],
	path,
	error;

	if(schema.resultListLocator) {
	    path = Y.DataSchema.JSON.getPath(schema.resultListLocator);
	    if(path) {
		results = Y.DataSchema.JSON.getLocationValue(path, json_in);
		if (results === undefined) {
		    data_out.results = [];
		    error = new Error("JSON results retrieval failure");
		}
		else {
		    if(Lang.isArray(results)) {
			// if no result fields are passed in, then just take the results array whole-hog
			// Sometimes you're getting an array of strings, or want the whole object,
			// so resultFields don't make sense.
			if (Lang.isArray(schema.resultFields)) {
			    data_out = Y.DataSchema.JSON._getFieldValues.call(this, schema.resultFields, results, data_out);
			}
			else {
			    data_out.results = results;
			}
		    } else if (Lang.isObject(results)) {			// Added
			if (Lang.isArray(schema.resultFields)) {
			    data_out = Y.DataSchema.JSON._getFieldValues.call(this, schema.resultFields, [results], data_out);
			}
			else {
			    data_out.results = [results];
			}
		    } else {
			data_out.results = [];
			error = new Error("JSON Schema fields retrieval failure");
		    }
		}
	    }
	    else {
		error = new Error("JSON Schema results locator failure");
	    }

	    if (error) {
		data_out.error = error;
	    }

	}
	return data_out;
    }
    
    //FIXME Hack so plugin host accepts string definition of classes
    Y.DataSource.IO.prototype.plug = function(Plugin, config) {
	var i, ln, ns;

	if (Lang.isArray(Plugin)) {
	    for (i = 0, ln = Plugin.length; i < ln; i++) {
		this.plug(Plugin[i]);
	    }
	} else {
	    if (Plugin && !Lang.isFunction(Plugin)) {
		config = Plugin.cfg;
		Plugin = Plugin.fn;
	    }
	    if (Plugin && !Lang.isFunction(Plugin)) {			// !Added
		Plugin = Y.Plugin[Plugin];
	    }

	    // Plugin should be fn by now
	    if (Plugin && Plugin.NS) {
		ns = Plugin.NS;
        
		config = config || {};
		config.host = this;
        
		if (this.hasPlugin(ns)) {
		    // Update config
		    this[ns].setAttrs(config);
		} else {
		    // Create new instance
		    this[ns] = new Plugin(config);
		    this._plugins[ns] = Plugin;
		}
	    }
	}
	return this;
    };
    
});