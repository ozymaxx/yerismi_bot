import { expect } from "chai";
import { describe, it } from "mocha";
import { ResponseFactory } from "../responseFactory";
import { Constants } from "../constants";

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
});