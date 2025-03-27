import {formatCurreny} from "../../scripts/utils/money.js";

describe('test suite: formatCurrency', () => {
    it('convert cents into dollars', () => {
        expect(formatCurreny(2095)).toEqual('20.95');
    });

    it('works with 0', () => {
        expect(formatCurreny(0)).toEqual('0.00');
    });

    it('rounds up to the nearest cent', () => {
        expect(formatCurreny(2000.5)).toEqual('20.01');
    });
});

