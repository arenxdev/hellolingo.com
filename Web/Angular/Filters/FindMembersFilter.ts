namespace Filters{

	export enum SortMembersBy { Id = 1, Name = 2, Country = 3, Knows = 4, Learns = 5 }

	export function findMembersFilter($filter: ng.IFilterService, serverResources: Services.IServerResourcesService) {
		const countries = serverResources.getCountries();
		return (members: ILightUser[], propertyToSort: SortMembersBy) => {
			const orderByFilter = $filter("orderBy");
			switch (propertyToSort) {
				case SortMembersBy.Name:
					return orderByFilter(members, (m: ILightUser) => { return m.firstName; });
				case SortMembersBy.Country:
					return orderByFilter(members, (m: ILightUser) => { return countries[m.country].text; });
				case SortMembersBy.Learns:
					return orderByFilter(members, (m: ILightUser) => {
						if (!Languages.langsById[m.learns]) return undefined;
						return Languages.langsById[m.learns].text;
					});
				case SortMembersBy.Knows:
					return orderByFilter(members, (m: ILightUser) => {
						if (!Languages.langsById[m.knows]) return undefined;
						return Languages.langsById[m.knows].text;
					});
				default:
					return orderByFilter(members, (m: ILightUser) => { return -m.id; });
			}
		}
	}
}