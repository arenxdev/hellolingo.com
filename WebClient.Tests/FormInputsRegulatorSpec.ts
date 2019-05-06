module UnitTests {
	describe("FormInputsRegulator", () => {
		it("clenup last name", () => {
			const input = " .Smi.th... ";
			const inputResult = "Smi.th...";
			const cleanedInpupt = FormInputsRegulator.cleanLastName(input);
			expect(cleanedInpupt).toBe(inputResult, "Last name cleanup failed");
		});

		it("clenup last name one dot", () => {
			const input = " . ";
			const inputResult = "";
			const cleanedInpupt = FormInputsRegulator.cleanLastName(input);
			expect(cleanedInpupt).toBe(inputResult, "Last name one dot cleanup failed");
		});

		it("cleanup last name is undefined", () => {
			const input = undefined;
			const inputResult = undefined;
			const cleanedInpupt = FormInputsRegulator.cleanLastName(input);
			expect(cleanedInpupt).toBe(inputResult, "Last must be undefined");
		});

		it("clenup location", () => {
			const input = "  ,'  - \\&().Ky.&(,')i()v.,'&(\\--) ";
			const inputResult = "Ky.&(,')i()v.";
			const cleanedInpupt = FormInputsRegulator.cleanLocation(input);
			expect(cleanedInpupt).toBe(inputResult, "Location cleanup failed");
		});

		it("clenup location to empty", () => {
			const input = " &().,'.&()().&( )";
			const inputResult = undefined;
			const cleanedInpupt = FormInputsRegulator.cleanLocation(input);
			expect(cleanedInpupt).toBe(inputResult, "Empty location cleanup failed");
		});

		it("location is undefined", () => {
			const input = undefined;
			const inputResult = undefined;
			const cleanedInpupt = FormInputsRegulator.cleanLocation(input);
			expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
		});
		it("location is undefined after dots", () => {
			const input = "...";
			const inputResult = undefined;
			const cleanedInpupt = FormInputsRegulator.cleanLocation(input);
			expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
		});

		it("clenup first name", () => {
			const input = " -\\Ky\\-\\iv-- \\";
			const inputResult = "Ky\\-\\iv";
			const cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
			expect(cleanedInpupt).toBe(inputResult, "Location cleanup failed");
		});

		it("clenup first name to empty", () => {
			const input = "\\-\-\ -\-\-";
			const inputResult = "";
			const cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
			expect(cleanedInpupt).toBe(inputResult, "Empty location cleanup failed");
		});

		it("first name is undefined", () => {
			const input = undefined;
			const inputResult = undefined;
			const cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
			expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
		});

	});
}