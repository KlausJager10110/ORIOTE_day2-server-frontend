import { describe, it, expect } from "vitest";
import { max } from "../utils/func-test"; // Adjust path to where your `max` function is located

describe("max function", () => {
    it("should return the first argument if it is greater", () => {
        // Arrange
        const a = 2;
        const b = 1;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBe(2); // a is greater, so result should be 2
    });

    it("should return the second argument if it is greater", () => {
        // Arrange
        const a = 1;
        const b = 2;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBe(2); // b is greater, so result should be 2
    });

    it("should return the first argument if both arguments are equal", () => {
        // Arrange
        const a = 2;
        const b = 2;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBe(2); // a and b are equal, so result should be a (2)
    });

    it("should handle negative numbers", () => {
        // Arrange
        const a = -1;
        const b = -2;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBe(-1); // -1 is greater than -2, so result should be -1
    });

    it("should handle zero", () => {
        // Arrange
        const a = 0;
        const b = -5;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBe(0); // 0 is greater than -5, so result should be 0
    });

    it("should return NaN if one or both arguments are NaN", () => {
        // Arrange
        const a = NaN;
        const b = 5;

        // Act
        const result = max(a, b);

        // Assert
        expect(result).toBeNaN(); // NaN should return NaN in any comparison
    });
});
