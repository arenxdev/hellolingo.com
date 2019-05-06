/// <reference path="FindMembersFilter.ts" />
namespace Filters {
	const app = angular.module("app.filters", []);
	
	// USAGE: ' ... | greaterThan:'myProp':value ' 
	// e.g.: ' ... | greaterThan:'age':16 ' ==>  item[age] > 16 
	//app.filter("greaterThan", () => (items, prop, val) => {
	//	var filtered = [];
	//	angular.forEach(items, item => { if (item[prop] > val) filtered.push(item); });
	//	return filtered;
	//});
	app.filter("findMembers", ["$filter", "serverResources", findMembersFilter]);
}