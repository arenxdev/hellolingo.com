namespace UnitTests {

	describe("memberFilter", () => {
		let $filter: ng.IFilterService;
		let resources: Services.IServerResourcesService;
		beforeEach(() => {
			angular.mock.module("app.filters");
			angular.mock.module({
				"serverResources": {
					getCountries: () => {
						const countriesList: Countries.ICountry[] = [
							{ id: 0, text: "United States", displayOrder: 1 },//index=0
							{ id: 1, text: "Argentina", displayOrder: 1 }     //index=1
						];
						return countriesList;
					}
				}
			});
		})

		beforeEach(inject((_$filter_: ng.IFilterService, serverResources: Services.IServerResourcesService) => {
			$filter = _$filter_;
			resources = serverResources;
		})); 

		it("filters by name", () => {
			const initMembers = [
				{ firstName: "John" } as Find.IMember,
				{ firstName: "Andriy" } as Find.IMember,
			];
			const filter = Filters.findMembersFilter($filter, resources);

			const filteredMembers = filter(initMembers, Filters.SortMembersBy.name);
			expect(initMembers.length).toEqual(2);
			expect(filteredMembers.length).toEqual(2);
			expect(filteredMembers[0].firstName).toEqual(initMembers[1].firstName);
			expect(filteredMembers[1].firstName).toEqual(initMembers[0].firstName);
		});

		it("filters by id", () => {
			const initMembers = [
				{ firstName: "John", id:10 } as Find.IMember,
				{ firstName: "Andriy", id:2 } as Find.IMember,
			];
			const filter = Filters.findMembersFilter($filter, resources);

			const filteredMembers = filter(initMembers, Filters.SortMembersBy.id);
			expect(initMembers.length).toEqual(2);
			expect(filteredMembers.length).toEqual(2);
			expect(filteredMembers[0].id).toEqual(initMembers[0].id);
			expect(filteredMembers[1].id).toEqual(initMembers[1].id);
		});

		it("filters by country", () => {
			const initMembers = [
				{ firstName: "John", id: 10, country: 0/*United States*/ } as Find.IMember,
				{ firstName: "Andriy", id: 2, country: 1/*Argentina*/ } as Find.IMember,
			];
			const filter = Filters.findMembersFilter($filter, resources);
			const filteredMembers = filter(initMembers, Filters.SortMembersBy.country);
			const countries = resources.getCountries();
			expect(initMembers.length).toEqual(2);
			expect(filteredMembers.length).toEqual(2);
			expect(countries[filteredMembers[0].country].text).toEqual(countries[initMembers[1].country].text);
			expect(countries[filteredMembers[1].country].text).toEqual(countries[initMembers[0].country].text);
		});

		it("filters by lern", ()=>{
			const initMembers = [
				{ firstName: "John"  , id: 10, learns: 9 } as Find.IMember,
				{ firstName: "Andriy", id: 2 , learns: 1 } as Find.IMember,
			];
			const filter = Filters.findMembersFilter($filter, resources);
			const filteredMembers = filter(initMembers, Filters.SortMembersBy.learns);
			const lang = Languages.languagesById;

			expect(initMembers.length).toEqual(2);
			expect(filteredMembers.length).toEqual(2);
			expect(lang[filteredMembers[0].learns].text).toEqual(lang[initMembers[1].learns].text);
			expect(lang[filteredMembers[1].learns].text).toEqual(lang[initMembers[0].learns].text);
		});

		it("filters by known", () => {
			const initMembers = [
				{ firstName: "John", id: 10,  knows: 8 } as Find.IMember,
				{ firstName: "Andriy", id: 2, knows: 3 } as Find.IMember,
			];
			const filter = Filters.findMembersFilter($filter, resources);
			const filteredMembers = filter(initMembers, Filters.SortMembersBy.knows);
			const lang = Languages.languagesById;

			expect(initMembers.length).toEqual(2);
			expect(filteredMembers.length).toEqual(2);
			expect(lang[filteredMembers[0].knows].text).toEqual(lang[initMembers[1].knows].text);
			expect(lang[filteredMembers[1].knows].text).toEqual(lang[initMembers[0].knows].text);
		});
	});
}