import 'jest';
import {Logger} from './Logger';


// Mocking fetch
 global.fetch = jest.fn(() => new Promise(resolve => resolve()));

let l = new Logger()
describe("create logger", () => { 
    it("exists", () => {
        expect(l).toBeInstanceOf(Logger)
    })
    it("saves the browsers name", () => {
        expect(l.ua).toEqual("Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0") 
    })

    it("should measure the pxiel ratio", () => {
        expect(l.pixelRatio).toEqual(1) 
    })

    it("should have a random user id", () => {
        expect(l.user).not.toBe("")
    })
})

describe("log something", () => {
        it("saves a log-message", () => {
        })
})
