"use strict";
exports.__esModule = true;
var RDNode;
(function (RDNode_1) {
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
        var strlist = ls.map(function (n) { return n.uniqueId; });
        log(strlist.join(" "));
    }
    var RDArrow = /** @class */ (function () {
        function RDArrow(uniqueId) {
            this.id = "RDArrow";
            this.to = null;
            this.from = null;
            this.distance = 0;
            this.uniqueId = uniqueId;
        }
        return RDArrow;
    }());
    var RDNode = /** @class */ (function () {
        function RDNode(uniqueId, env) {
            this.id = "RDNode";
            this.to = [];
            this.from = [];
            this.toGoal = 0;
            this.fromStart = null;
            this.closed = false;
            this.env = env;
            this.uniqueId = uniqueId;
        }
        RDNode.prototype.toString = function (typ, table) {
            var _this = this;
            if (typ === void 0) { typ = "dot"; }
            if (table === void 0) { table = {}; }
            var ret = "";
            table[this.uniqueId] = true;
            this.to.forEach(function (n) {
                ret += _this.uniqueId + " -> " + n.to.uniqueId + ("[label=\"" + n.distance + "\"] ;\n");
                if (table[n.to.uniqueId]) {
                    return;
                }
                ret += n.to.toString(typ, table);
            });
            return ret;
        };
        RDNode.prototype.getMostMinumDistanceParent = function () {
            if (this.from.length == 0) {
                return null;
            }
            if (this.from.length == 1) {
                return this.from[0].from;
            }
            var ret = this.from[0];
            this.from.forEach(function (x) {
                if (ret.distance > x.distance) {
                    ret = x;
                }
            });
            return ret.from;
        };
        RDNode.prototype.parents = function (rootUniqueId) {
            if (this.uniqueId == rootUniqueId) {
                return [this];
            }
            var minParent = this.getMostMinumDistanceParent();
            if (minParent == null) {
                return [this];
            }
            var ret = minParent.parents(rootUniqueId);
            ret.push(this);
            return ret;
        };
        RDNode.prototype.add = function (node, distance) {
            setArrow(this, node, distance, this.env);
            return node;
        };
        return RDNode;
    }());
    function setArrow(from, to, distance, env) {
        env.edgeid++;
        var arrow = new RDArrow(env.edgeid.toString());
        arrow.distance = distance;
        arrow.to = to;
        arrow.from = from;
        from.to.push(arrow);
        to.from.push(arrow);
        return true;
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
    // function popRandomPair<T>(ls: T[]): { first: T, second: T | null } | null {
    //     if (ls.length == 0) {
    //         return null
    //     }
    //     return { first: popRandom(ls)!, second: popRandom(ls) }
    // }
    // function makeRandomTree(ls: Tree[]): Tree | null {
    //     logDebug("makeRandomTree:" + ls.length)
    //     ifdebug(() => {
    //         logList(ls)
    //     })
    //     if (ls.length == 0) {
    //         return null
    //     }
    //     if (ls.length == 1) {
    //         return ls[0]
    //     }
    //     const parent = popRandom(ls)!
    //     // log("parent"+parent.value)
    //     const childs = popRandomPair(ls)
    //     if (childs == null) {
    //         return parent;
    //     }
    //     setTree(parent, childs.first)
    //     if (childs.second) {
    //         setTree(parent, childs.second)
    //     }
    //     ls.push(parent)
    //     return makeRandomTree(ls)
    // }
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
                    var el = t.uniqueId + (" [color=" + color + "] ;\n");
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
    // function getNumberTrees(num: number): Tree[] {
    //     const nums = getNumberList(num)
    //     const trees = nums.map((num) => {
    //         return new Tree(num.toString())
    //     })
    //     return trees
    // }
    // function sampleNetwork(num: number): Tree {
    //     return makeRandomTree(getNumberTrees(num))!
    // }
    function treeTest() {
        var env = { nodeid: 0, edgeid: 0 };
        var node1 = new RDNode("1", env);
        var node2 = new RDNode("2", env);
        var node3 = new RDNode("3", env);
        var node4 = new RDNode("4", env);
        var node5 = new RDNode("5", env);
        var node6 = new RDNode("6", env);
        var node7 = new RDNode("7", env);
        node1.add(node2, 3);
        node1.add(node3, 6);
        node2.add(node1, 2);
        node2.add(node4, 2);
        node2.add(node5, 2);
        node3.add(node4, 3);
        node3.add(node6, 3);
        node4.add(node6, 2);
        node4.add(node7, 5);
        node5.add(node7, 3);
        node6.add(node7, 2);
        node1.toGoal = 3;
        node2.toGoal = 2;
        node3.toGoal = 2;
        node4.toGoal = 1;
        node5.toGoal = 1;
        node6.toGoal = 1;
        // console.log(getString(node1))
        var result = search_Dijkstra("7", node1);
        console.log(getString(node1, [result.history, result.result.parents(node1.uniqueId)]));
    }
    RDNode_1.treeTest = treeTest;
    // export function searchTest() {
    //     const num = 1000;
    //     const tree = makeRandomTree(getNumberTrees(num))!
    //     const target = Math.floor(Math.random() * num)
    //     // console.log("SerchTarget:"+target)
    //     const result = search_DepthFirst(target.toString(), tree)
    //     if (result.result != null) {
    //         const resStr = getString(tree, [result.hisotry, result.result.parents()]);
    //         console.log(resStr);
    //     } else {
    //         console.log("not found...")
    //     }
    // }
    function search_Dijkstra(goal, node) {
        var list = [node];
        var history = [];
        node.fromStart = 0;
        var _loop_1 = function () {
            logDebug("Search:");
            ifdebug(function () { logList(list); });
            var target = list.pop();
            if (!target) {
                return { value: { result: null, history: history } };
            }
            history.push(target);
            if (target.uniqueId == goal) {
                logDebug("find!");
                return { value: { result: target, history: history } };
            }
            /// targetからつながっているノードの更新
            var nextTarget = null;
            target.to.forEach(function (n) {
                if (!n.to) {
                    return;
                }
                if (n.to.closed) {
                    return;
                }
                if (nextTarget == null) {
                    nextTarget = n.to;
                }
                var fromStart = target.fromStart + n.distance;
                if (n.to.fromStart == null || n.to.fromStart > fromStart) {
                    n.to.fromStart = fromStart;
                }
                if (nextTarget.fromStart == null || nextTarget.fromStart > n.to.fromStart) {
                    nextTarget = n.to;
                }
            });
            if (nextTarget) {
                target.closed = true;
                list.push(nextTarget);
            }
        };
        while (true) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
})(RDNode = exports.RDNode || (exports.RDNode = {}));
//Tree.treeTest()
RDNode.treeTest();
