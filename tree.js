"use strict";
// Created by KatagiriSo(Rodhos Soft)
exports.__esModule = true;
var Tree;
(function (Tree_1) {
    var output = true;
    var debug = false;
    function log(text) {
        if (!output) {
            return;
        }
        console.log(text);
    }
    function ifdebug(f) {
        if (debug) {
            f();
        }
    }
    function logDebug(text) {
        if (!debug) {
            return;
        }
        console.log(text);
    }
    function logList(ls) {
        var strlist = ls.map(function (n) { return n.value; });
        log(strlist.join(" "));
    }
    var Tree = /** @class */ (function () {
        function Tree(value) {
            this.id = "Tree";
            this.left = null;
            this.right = null;
            this.parent = null;
            this.value = value;
        }
        Tree.prototype.toString = function (typ) {
            if (typ === void 0) { typ = "dot"; }
            var ret = "";
            if (this.left) {
                ret += this.value + " -> " + this.left.value + " ;\n";
                ret += this.left.toString(typ);
            }
            if (this.right) {
                ret += this.value + " -> " + this.right.value + " ;\n";
                ret += this.right.toString(typ);
            }
            return ret;
        };
        Tree.prototype.parents = function () {
            if (this.parent == null) {
                return [this];
            }
            var ret = this.parent.parents();
            ret.push(this);
            return ret;
        };
        return Tree;
    }());
    function setTree(target, item) {
        if (target.left == null) {
            target.left = item;
            item.parent = target;
            return true;
        }
        if (target.right == null) {
            target.right = item;
            item.parent = target;
            return true;
        }
        if (setTree(target.left, item)) {
            return true;
        }
        if (setTree(target.right, item)) {
            return true;
        }
        return false;
    }
    function getNumberList(num) {
        var ret = [];
        for (var i = 0; i < num; i = i + 1) {
            ret.push(i);
        }
        return ret;
    }
    function popRandom(ls) {
        if (ls.length == 0) {
            return null;
        }
        var index = Math.floor(Math.random() * ls.length);
        var ret = ls.splice(index, 1);
        if (ret.length == 0) {
            return null;
        }
        return ret[0];
    }
    function popRandomPair(ls) {
        if (ls.length == 0) {
            return null;
        }
        return { first: popRandom(ls), second: popRandom(ls) };
    }
    function makeRandomTree(ls) {
        logDebug("makeRandomTree:" + ls.length);
        ifdebug(function () {
            logList(ls);
        });
        if (ls.length == 0) {
            return null;
        }
        if (ls.length == 1) {
            return ls[0];
        }
        var parent = popRandom(ls);
        // log("parent"+parent.value)
        var childs = popRandomPair(ls);
        if (childs == null) {
            return parent;
        }
        setTree(parent, childs.first);
        if (childs.second) {
            setTree(parent, childs.second);
        }
        ls.push(parent);
        return makeRandomTree(ls);
    }
    function getString(tree, lines, typ) {
        if (lines === void 0) { lines = []; }
        if (typ === void 0) { typ = "dot"; }
        var list = [];
        var first = "digraph graph_name {\n";
        list.push(first);
        var edge = "edge [style = \"solid\"];";
        list.push(edge);
        var node = "node [color = \"#000000\"];";
        list.push(node);
        var colorList = ["\"#00FF00\"", "\"#FF0000\"", "\"#0000FF\""];
        if (lines.length != 0) {
            lines.forEach(function (line) {
                var color = colorList.shift();
                if (!color) {
                    color = "\"#888888\"";
                }
                line.forEach(function (t) {
                    var el = t.value + (" [color=" + color + "] ;\n");
                    list.push(el);
                });
            });
        }
        var treeStr = tree.toString(typ);
        list.push(treeStr);
        var end = "}\n";
        list.push(end);
        return list.join("");
    }
    function getNumberTrees(num) {
        var nums = getNumberList(num);
        var trees = nums.map(function (num) {
            return new Tree(num.toString());
        });
        return trees;
    }
    function sampleNetwork(num) {
        return makeRandomTree(getNumberTrees(num));
    }
    function treeTest() {
        var trees = getNumberTrees(1000);
        // const count = trees.length
        // const p = popRandom(trees)
        // if (count != trees.length + 1) {
        //     log("[Error] popRandomCount:"+ trees.length)
        // }
        // const count2 = trees.length
        // const p2 = popRandomPair(trees)
        // if (count2 != trees.length + 2) {
        //     log("[Error] popRandomCount:"+ trees.length)
        // }
        var r = makeRandomTree(trees);
        console.log(getString(r));
    }
    Tree_1.treeTest = treeTest;
    function searchTest() {
        var num = 1000;
        var tree = makeRandomTree(getNumberTrees(num));
        var target = Math.floor(Math.random() * num);
        // console.log("SerchTarget:"+target)
        var result = search_DepthFirst(target.toString(), tree);
        if (result.result != null) {
            var resStr = getString(tree, [result.hisotry, result.result.parents()]);
            console.log(resStr);
        }
        else {
            console.log("not found...");
        }
    }
    Tree_1.searchTest = searchTest;
    function search_DepthFirst(value, tree) {
        var list = [tree];
        var history = [];
        while (true) {
            logDebug("Search:");
            ifdebug(function () { logList(list); });
            var target = list.pop();
            if (!target) {
                return { result: null, hisotry: history };
            }
            history.push(target);
            if (target.value == value) {
                return { result: target, hisotry: history };
            }
            if (target.left) {
                list.push(target.left);
            }
            if (target.right) {
                list.push(target.right);
            }
        }
    }
})(Tree = exports.Tree || (exports.Tree = {}));
//Tree.treeTest()
Tree.searchTest();
