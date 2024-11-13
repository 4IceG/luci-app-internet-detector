'use strict';
'require baseclass';
'require fs';
'require uci';


document.head.append(E('style', {'type': 'text/css'},
`
:root {
	--app-id-font-color: #454545;
	--app-id-font-shadow: #fff;
	--app-id-connected-color: #6bdebb;
	--app-id-disconnected-color: #f8aeba;
	--app-id-undefined-color: #dfdfdf;
}
:root[data-darkmode="true"] {
	--app-id-font-color: #f6f6f6;
	--app-id-font-shadow: #4d4d4d;
	--app-id-connected-color: #005F20;
	--app-id-disconnected-color: #a93734;
	--app-id-undefined-color: #4d4d4d;
}
.id-connected {
	--on-color: var(--app-id-font-color);
	background-color: var(--app-id-connected-color) !important;
	border-color: var(--app-id-connected-color) !important;
	color: var(--app-id-font-color) !important;
	text-shadow: 0 1px 1px var(--app-id-font-shadow);
}
.id-disconnected {
	--on-color: var(--app-id-font-color);
	background-color: var(--app-id-disconnected-color) !important;
	border-color: var(--app-id-disconnected-color) !important;
	color: var(--app-id-font-color) !important;
	text-shadow: 0 1px 1px var(--app-id-font-shadow);
}
.id-label-status {
	display: inline-block;
	word-wrap: break-word;
	margin: 2px !important;
	padding: 4px 8px;
	border: 1px solid;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
	font-weight: bold;
}
`));


return L.Class.extend({
	title: _('Internet'),

	hosts: [
		'8.8.8.8',
		'1.1.1.1',
		'8.8.4.4',
	],

	checkInterval: 11,		// 5 x 11 = 55 sec.

	load: async function() {
		window.internetDetectorCounter = ('internetDetectorCounter' in window) ?
			++window.internetDetectorCounter : 0;
		if(!('internetDetectorState' in window)) {
			window.internetDetectorState = 1;
		};

		if(window.internetDetectorState === 0 &&
			window.internetDetectorCounter % this.checkInterval) {
			return;
		};

		for(let host of this.hosts) {
			await fs.exec('/bin/ping', [ '-c', '1', '-W', '1', host ]).then(res => {
				window.internetDetectorState = res.code;
			}).catch(e => {});

			if(window.internetDetectorState === 0) {
				break;
			};
		};
	},

	render: function() {

		let inetStatusArea = E('div', {});

		if(window.internetDetectorState === 0) {

				let status    = _('Internet connected');
				let className = 'id-label-status id-connected';
				inetStatusArea.append(
					E('span', { 'class': className }, '%s'.format(
						status)
					)
				);

		} else {

				let status    = _('Internet disconnected');
				let className = 'id-label-status id-disconnected';
				inetStatusArea.append(
					E('span', { 'class': className }, '%s'.format(
						status)
					)
				);

		};

		return E('div', {
			'class': 'cbi-section',
			'style': 'margin-bottom:1em',
		}, inetStatusArea);
	},
});
