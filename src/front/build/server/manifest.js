const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.Cwq6l_sG.js",app:"_app/immutable/entry/app.C-MCGumj.js",imports:["_app/immutable/entry/start.Cwq6l_sG.js","_app/immutable/chunks/oUNiI-U7.js","_app/immutable/chunks/POUC0KUS.js","_app/immutable/chunks/J-xoz_hm.js","_app/immutable/entry/app.C-MCGumj.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/POUC0KUS.js","_app/immutable/chunks/C7He8RFb.js","_app/immutable/chunks/Cr3gpN3R.js","_app/immutable/chunks/J-xoz_hm.js","_app/immutable/chunks/DNhcs3rL.js","_app/immutable/chunks/CtHl_d8L.js","_app/immutable/chunks/PTCA9BDJ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-y_jIjU99.js')),
			__memo(() => import('./chunks/1--cdex0sD.js')),
			__memo(() => import('./chunks/2-CXSJ-Uls.js')),
			__memo(() => import('./chunks/3-CGpQSZE2.js')),
			__memo(() => import('./chunks/4-BR-7C0DF.js')),
			__memo(() => import('./chunks/5-BRVT2oji.js')),
			__memo(() => import('./chunks/6-9ht6LieF.js')),
			__memo(() => import('./chunks/7-BAuVJ8SR.js')),
			__memo(() => import('./chunks/8-CU8AdJ9_.js')),
			__memo(() => import('./chunks/9-DA-_UUtz.js')),
			__memo(() => import('./chunks/10-D3eM1y7X.js')),
			__memo(() => import('./chunks/11-BhGAFEf1.js')),
			__memo(() => import('./chunks/12-BrOiUPVE.js')),
			__memo(() => import('./chunks/13-QYseOaKQ.js')),
			__memo(() => import('./chunks/14-9QXiWbUZ.js')),
			__memo(() => import('./chunks/15-C5eI9V7H.js')),
			__memo(() => import('./chunks/16-B9h9Buld.js')),
			__memo(() => import('./chunks/17-ju3JCNrT.js')),
			__memo(() => import('./chunks/18-B0KflCZ3.js')),
			__memo(() => import('./chunks/19-DzwV7hBi.js')),
			__memo(() => import('./chunks/20-BjzXuX7s.js')),
			__memo(() => import('./chunks/21-BepGF00T.js')),
			__memo(() => import('./chunks/22-BQWg84B_.js')),
			__memo(() => import('./chunks/23-Bn__wYSy.js')),
			__memo(() => import('./chunks/24-GXANk9pr.js')),
			__memo(() => import('./chunks/25-BBl08m1c.js')),
			__memo(() => import('./chunks/26-BjbJCqE3.js')),
			__memo(() => import('./chunks/27-DsiUB_Fy.js')),
			__memo(() => import('./chunks/28-Cdyr4__x.js')),
			__memo(() => import('./chunks/29-D7k6q0oL.js')),
			__memo(() => import('./chunks/30-kq_SRykc.js')),
			__memo(() => import('./chunks/31-D0Rbz2BS.js')),
			__memo(() => import('./chunks/32-DoyrwISL.js')),
			__memo(() => import('./chunks/33-BvErKLNt.js')),
			__memo(() => import('./chunks/34-DlnHGbFP.js')),
			__memo(() => import('./chunks/35-CaFmFJRb.js')),
			__memo(() => import('./chunks/36-abjFvSvL.js')),
			__memo(() => import('./chunks/37-DbUPcFj3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/analytics",
				pattern: /^\/analytics\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/analytics/conflict-stats",
				pattern: /^\/analytics\/conflict-stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/analytics/conflict-stats/map",
				pattern: /^\/analytics\/conflict-stats\/map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/analytics/exportations-stats",
				pattern: /^\/analytics\/exportations-stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/analytics/exportations-stats/map",
				pattern: /^\/analytics\/exportations-stats\/map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/analytics/military-stats",
				pattern: /^\/analytics\/military-stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/conflict-stats",
				pattern: /^\/conflict-stats\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/conflict-stats/[location]/[year]",
				pattern: /^\/conflict-stats\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"location","optional":false,"rest":false,"chained":false},{"name":"year","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/exportations-stats",
				pattern: /^\/exportations-stats\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/exportations-stats/[recipient]/[year_of_order]",
				pattern: /^\/exportations-stats\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"recipient","optional":false,"rest":false,"chained":false},{"name":"year_of_order","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats",
				pattern: /^\/integrations\/conflict-stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/coin-gecko",
				pattern: /^\/integrations\/conflict-stats\/coin-gecko\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/global-ev-charging-infraestructures",
				pattern: /^\/integrations\/conflict-stats\/global-ev-charging-infraestructures\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/open-meteo",
				pattern: /^\/integrations\/conflict-stats\/open-meteo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/open-weather-map",
				pattern: /^\/integrations\/conflict-stats\/open-weather-map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/pokeapi",
				pattern: /^\/integrations\/conflict-stats\/pokeapi\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/soporte-average-annual-temperatures",
				pattern: /^\/integrations\/conflict-stats\/soporte-average-annual-temperatures\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/integrations/conflict-stats/world-bank",
				pattern: /^\/integrations\/conflict-stats\/world-bank\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/brewery",
				pattern: /^\/integrations\/exportations-stats\/brewery\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/cereal-productions",
				pattern: /^\/integrations\/exportations-stats\/cereal-productions\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/global-agriculture-climate-impacts",
				pattern: /^\/integrations\/exportations-stats\/global-agriculture-climate-impacts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/meal",
				pattern: /^\/integrations\/exportations-stats\/meal\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/rest-countries",
				pattern: /^\/integrations\/exportations-stats\/rest-countries\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/integrations/exportations-stats/wine-stats",
				pattern: /^\/integrations\/exportations-stats\/wine-stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/integrations/military-stats/coffee-ingredients",
				pattern: /^\/integrations\/military-stats\/coffee-ingredients\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/integrations/military-stats/gas-price",
				pattern: /^\/integrations\/military-stats\/gas-price\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/integrations/military-stats/global-ev-sales",
				pattern: /^\/integrations\/military-stats\/global-ev-sales\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/integrations/military-stats/ozone-depleting-substance-consumptions",
				pattern: /^\/integrations\/military-stats\/ozone-depleting-substance-consumptions\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/integrations/military-stats/studio-ghibli",
				pattern: /^\/integrations\/military-stats\/studio-ghibli\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/military-stats",
				pattern: /^\/military-stats\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/military-stats/[country]/[year]",
				pattern: /^\/military-stats\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"country","optional":false,"rest":false,"chained":false},{"name":"year","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,], errors: [1,,], leaf: 37 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
