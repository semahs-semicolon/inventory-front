export const RouteName = {
	'/dashboard': '대시보드',
	'/dashboard/category/*': '카테고리',
	'/dashboard/notice/*': '공지',
	'/dashboard/products/*': '물품',
	'/dashboard/tree/*': '물품 나무',
	'/dashboard/orphans/*': '분류가 필요한 항목',
	'/dashboard/nfc/*': 'NFC'
};

/**
 *
 * @param {string} routes
 * @return {string | null}
 */
export function routeMatches(routes) {
	let returns = null;
	if (routes) {
		Object.keys(RouteName).forEach((key) => {
			if (key.endsWith('/*')) {
				const rootRoute = key.split('/*')[0];
				if (routes.startsWith(rootRoute)) returns = RouteName[key];
			} else {
				if (routes === key) returns = RouteName[key];
			}
		});
	}
	return returns;
}

/**
 *
 * @param {Array<string>} routes
 * @param {string} route
 * @return {boolean}
 */
export function routeIncludes(routes, route) {
	return routes.some((i) => {
		if (i.endsWith('/*')) {
			return route.startsWith(i.split('/*')[0]);
		} else {
			return route === i;
		}
	});
}
