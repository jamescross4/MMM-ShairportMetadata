/* global Log, Module */

/* Magic Mirror
 * Module: MMM-ShairportMetadata
 *
 * By Prateek Sureka <surekap@gmail.com>
 * MIT Licensed.
 */

Module.register("MMM-ShairportMetadata",{

	// Module config defaults.
	defaults: {
		metadataPipe: "/tmp/shairport-sync-metadata",
		alignment: "center",
		head: "off",
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		
		// Schedule update timer.
		var self = this;
		this.sendSocketNotification('CONFIG', this.config);
		setInterval(() => {
			this.updateDom(1000);
		}, 1000);
	},

	socketNotificationReceived: function(notification, payload){
		if(notification === 'DATA'){
			if (payload.hasOwnProperty('image')){
				this.albumart = payload['image'];
			}else{
				this.metadata = payload;
			}
			this.updateDom(1000);
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "small";
		alignment = (this.config.alignment == "left") ? "left" : ((this.config.alignment == "right") ? "right" : "center");
		wrapper.setAttribute("style", "text-align:" + alignment + ";width:200px")
		this.config.head = "off";
		
		if (!this.metadata || (Object.keys(this.metadata).length == 0)){
			wrapper.setAttribute("style", "display:none;width:200px;");
			return wrapper;
			this.config.head = "off";
		} else {
			this.config.head = "on";
		}
		
		metadata = document.createElement("div");
		imgtag = document.createElement("img");
		if (this.albumart){
			imgtag.setAttribute('src', this.albumart);
			imgtag.setAttribute('style', "width:200px;height:200px;");
		}
		imgtag.className = 'albumart';
		metadata.appendChild(imgtag);
		
		
		if (this.metadata['Title'] && this.metadata['Title'].length > 30){
			titletag = document.createElement("marquee");
			titletag.setAttribute('loop', '-1');
		}else{
			titletag = document.createElement("div");
		}
		
		titletag.innerHTML = (this.metadata['Title']) ? this.metadata['Title'] : "";
		titletag.className = "bright";
		metadata.appendChild(titletag)
		
		
		var txt = "";
		if (this.metadata['Artist'] || this.metadata['Album Name']){
			txt = this.metadata['Artist'] + " - " + this.metadata['Album Name']
		}
		if (txt.length > 50){
			artisttag = document.createElement('marquee');
			artisttag.setAttribute("loop", '-1')
		}else{
			artisttag = document.createElement('div');
		}
		artisttag.innerHTML = txt;
		artisttag.className = "xsmall";
		metadata.appendChild(artisttag)
		
		wrapper.appendChild(metadata);

		return wrapper;
	},
	getHeader: function() {
		if (this.config.head == "on") { 
			return this.data.header + "Now Playing - AirPlay";
		} 
		if (this.config.head == "off") {
			return this.data.header - "Now Playing - AirPlay";
		} 
	},
});
