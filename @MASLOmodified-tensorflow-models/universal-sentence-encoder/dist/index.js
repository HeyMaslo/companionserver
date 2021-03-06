"use strict";
var port = process.env.PORT || 8080;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var tokenizer_1 = require("./tokenizer");
exports.Tokenizer = tokenizer_1.Tokenizer;
var version_1 = require("./version");
exports.version = version_1.version;
var BASE_PATH = `http://localhost:${port}/tensorflowlocal/use/`
//var BASE_PATH = 'https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/';
function load() {
    return __awaiter(this, void 0, void 0, function () {
        var use;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    use = new UniversalSentenceEncoder();
                    return [4, use.load()];
                case 1:
                    _a.sent();
                    return [2, use];
            }
        });
    });
}
exports.load = load;
function loadTokenizer(pathToVocabulary) {
    return __awaiter(this, void 0, void 0, function () {
        var vocabulary, tokenizer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, loadVocabulary(pathToVocabulary)];
                case 1:
                    vocabulary = _a.sent();
                    tokenizer = new tokenizer_1.Tokenizer(vocabulary);
                    return [2, tokenizer];
            }
        });
    });
}
exports.loadTokenizer = loadTokenizer;
function loadVocabulary(pathToVocabulary) {
    if (pathToVocabulary === void 0) { pathToVocabulary = BASE_PATH + "vocab.json"; }
    return __awaiter(this, void 0, void 0, function () {
        var vocabulary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, tf.util.fetch(pathToVocabulary)];
                case 1:
                    vocabulary = _a.sent();
                    return [2, vocabulary.json()];
            }
        });
    });
}
var UniversalSentenceEncoder = (function () {
    function UniversalSentenceEncoder() {
    }
    UniversalSentenceEncoder.prototype.loadModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, tfconv.loadGraphModel(`http://localhost:${port}/tensorflowlocal/universal-sentence-encoder-lite_1_default_1/model.json`)];
            });
        });
    };
    UniversalSentenceEncoder.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, model, vocabulary;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, Promise.all([this.loadModel(), loadVocabulary()])];
                    case 1:
                        _a = _b.sent(), model = _a[0], vocabulary = _a[1];
                        this.model = model;
                        this.tokenizer = new tokenizer_1.Tokenizer(vocabulary);
                        return [2];
                }
            });
        });
    };
    UniversalSentenceEncoder.prototype.embed = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var encodings, indicesArr, flattenedIndicesArr, i, indices, values, embeddings;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof inputs === 'string') {
                            inputs = [inputs];
                        }
                        encodings = inputs.map(function (d) { return _this.tokenizer.encode(d); });
                        indicesArr = encodings.map(function (arr, i) { return arr.map(function (d, index) { return [i, index]; }); });
                        flattenedIndicesArr = [];
                        for (i = 0; i < indicesArr.length; i++) {
                            flattenedIndicesArr =
                                flattenedIndicesArr.concat(indicesArr[i]);
                        }
                        indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
                        values = tf.tensor1d(tf.util.flatten(encodings), 'int32');
                        return [4, this.model.executeAsync({ indices: indices, values: values })];
                    case 1:
                        embeddings = _a.sent();
                        indices.dispose();
                        values.dispose();
                        return [2, embeddings];
                }
            });
        });
    };
    return UniversalSentenceEncoder;
}());
exports.UniversalSentenceEncoder = UniversalSentenceEncoder;
//# sourceMappingURL=index.js.map