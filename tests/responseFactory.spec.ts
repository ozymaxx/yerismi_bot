import { expect } from "chai";
import { describe, it } from "mocha";
import { ResponseFactory } from "../responseFactory";
import { Constants } from "../constants";

class ResponseFactoryTestUtilities
{
    public static testLevenshteinDistanceMeasurement(
        firstString: string, secondString: string, expectedDistance: number): void
    {
        expect(ResponseFactory.levenshteinDistance(firstString, secondString)).to.be.equal(expectedDistance);
    }
}

describe("ResponseFactory", () => 
{
    it("produces the message containing the user's manual properly", () => 
    {
        expect(ResponseFactory.createResponse(Constants.HELP_COMMAND)).to.be.equal(ResponseFactory.HELP_STRING);
    });

    it("produces a fake place name properly", () => 
    {
        expect(ResponseFactory.createResponse(Constants.PLACE_NAME_COMMAND)).not.to.be.empty;
    });

    it("produces a fake proverb properly", () => 
    {
        expect(ResponseFactory.createResponse(Constants.PROVERB_COMMAND)).not.to.be.empty;
    });

    it("measures the levenshtein distance between two strings properly", () =>
    {
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("", "", 0);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("a", "", 1);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("a", "a", 0);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("a", "b", 1);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("ozan", "o", 3);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("banabirisimuret", "banabirisimu", 3);
        ResponseFactoryTestUtilities.testLevenshteinDistanceMeasurement("bnabirsmkuret", "banabirisimuret", 4);
    });
});