export namespace RDNode {

    let output = true
    let debug = false
    let snapshot = true
    let graphcount = 0

    interface Identifier {
        id: string
    }

    function log(text: String) {
        if (!output) {
            return
        }
        console.log(text)
    }

    function ifdebug(f: () => void) {
        if (debug) {
            f()
        }
    }

    function logDebug(text: String) {
        if (!debug) {
            return
        }
        console.log(text)
    }

    function logList(ls: RDNode[]) {
        const strlist = ls.map((n) => n.uniqueId)
        log(strlist.join(" "))
    }

    class RDArrow implements Identifier {
        id: "RDArrow" = "RDArrow"
        to: RDNode|null = null
        from: RDNode|null = null
        uniqueId: string 
        distance: number = 0
        constructor(uniqueId: string) {
            this.uniqueId = uniqueId
        }
    }

    interface Env {
        nodeid: number
        edgeid: number
    }

    class RDNode implements Identifier {
        env: Env;
        id: "RDNode" = "RDNode"
        to: RDArrow[] = []
        from: RDArrow[] = []
        toGoal: number = 0 
        fromStart: number|null = null
        uniqueId: string
        closed: boolean = false
        constructor(uniqueId: string, env: Env) {
            this.env = env
            this.uniqueId = uniqueId
        }

        toNodeSymbol(graphid:string = ""): string {
            return "\"id" + this.uniqueId + "(d=" + this.fromStart + ")" +":"+graphid+  "\"";
        }

        toString(typ: "dot" = "dot", table: any = {}): string {
            const graphIdstr = graphcount.toString()
            let ret = ""
            table[this.uniqueId] = true
            this.to.forEach((n) => {

                ret += this.toNodeSymbol(graphIdstr) + " -> " + n.to!.toNodeSymbol(graphIdstr) + `[label="${n.distance}"] ;\n`
                if (table[n.to!.uniqueId]) {
                    return
                }
                ret += n.to!.toString(typ, table)
            })
            return ret
        }

        getMostMinumDistanceParent(): RDNode | null {
            if (this.from.length == 0) {
                return null
            }
            if (this.from.length == 1) {
                return this.from[0].from
            }
            let ret = this.from[0]
            this.from.forEach((x) => {
                if (ret.from == null) {
                    ret = x
                    return
                }
                if (ret.from.fromStart == null) {
                    ret = x
                }

                if (x.from == null) {
                    return
                }
                if (x.from.from == null) {
                    return
                }
                logDebug("min check1:" + ret.from!.toNodeSymbol() + "distance:" + ret.distance);
                logDebug("min check2:" + x.from!.toNodeSymbol() + "distance:" + x.distance);
                if (ret.from!.fromStart! + ret.distance > x.from!.fromStart! + x.distance) {
                    logDebug("min update" + x.from.toNodeSymbol());
                    ret = x
                }
            })
            return ret.from
        }
        




        parents(rootUniqueId:string): RDNode[] {
            if (this.uniqueId == rootUniqueId) {
                return [this];
            }
            const minParent = this.getMostMinumDistanceParent()
            if (minParent == null) {
                return [this];
            }
            let ret = minParent.parents(rootUniqueId)
            ret.push(this)
            return ret
        }

        add(node: RDNode, distance:number): RDNode {
            setArrow(this, node, distance, this.env)
            return node
        }
    }

    function setArrow(from: RDNode, to: RDNode, distance:number, env: { nodeid: number, edgeid: number }): boolean {
        env.edgeid++;
        let arrow = new RDArrow(env.edgeid.toString())
        arrow.distance = distance
        arrow.to = to
        arrow.from = from
        from.to.push(arrow)
        to.from.push(arrow)
        return true
    }



    function getNumberList(num: number): number[] {
        let ret: number[] = []
        for (let i = 0; i < num; i = i + 1) {
            ret.push(i)
        }
        return ret
    }


    function popRandom<T>(ls: T[]): T | null {
        if (ls.length == 0) {
            return null
        }
        const index = Math.floor(Math.random() * ls.length)
        const ret = ls.splice(index, 1)
        if (ret.length == 0) {
            return null
        }
        return ret[0]
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


    function getString(tree: RDNode, lines: RDNode[][] = [], typ: "dot" = "dot") {
        let list: string[] = []
        graphcount++
        const graphIDStr = (graphcount).toString()
        const first = `subgraph cluster${graphIDStr} {\n`
        list.push(first)

        const edge = "edge [style = \"solid\"];\n"
        list.push(edge)

        const node = `node [color = \"#000000\"]\n;`
        list.push(node)

        const colorList = ["\"#00FF00\"", "\"#FF0000\"", "\"#0000FF\""]
        if (lines.length != 0) {
            lines.forEach((line) => {
                let color = colorList.shift()
                if (!color) {
                    color = "\"#888888\""
                }
                line.forEach((t) => {
                    const el = t.toNodeSymbol(graphIDStr) + ` [color=${color}] ;\n`
                    list.push(el)
                })

            })
        }

        const treeStr = tree.toString(typ)
        list.push(treeStr)


        const end = "}\n"
        list.push(end)
        return list.join("")
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

    export function treeTest() {

        const env: Env = { nodeid: 0, edgeid: 0 }
        const node1 = new RDNode("1", env)
        const node2 = new RDNode("2", env)
        const node3 = new RDNode("3", env)
        const node4 = new RDNode("4", env)
        const node5 = new RDNode("5", env)
        const node6 = new RDNode("6", env)
        const node7 = new RDNode("7", env)

        node1.add(node2, 3)
        node1.add(node3, 6)
        node2.add(node1, 2)
        node2.add(node4, 2)
        node2.add(node5, 2)
        node3.add(node4, 3)
        node3.add(node6, 3)
        node4.add(node6, 2)
        node4.add(node7, 5)
        node5.add(node7, 3)
        node6.add(node7, 2)

        node1.toGoal = 3
        node2.toGoal = 2
        node3.toGoal = 2
        node4.toGoal = 1
        node5.toGoal = 1
        node6.toGoal = 1

        // console.log(getString(node1))

        console.log("digraph graph_name {\n");

        const result = search_Dijkstra("7", node1)

        console.log(getString(node1, [result.history, result.result!.parents(node1.uniqueId)]))
        console.log("}\n")
    }



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

    function search_Dijkstra(goal: string, node: RDNode): { result: RDNode | null, history: RDNode[] } {
        let list: RDNode[] = [node]
        let history: RDNode[] = []

        node.fromStart = 0

        while (true) {
            logDebug("Search:")            
            ifdebug(() => { logList(list) })
            let target = list.shift()
            if (!target) {
                logDebug("nothing..")
                return { result: null, history: history }
            }
            history.push(target)
            if (snapshot) {
                const parents = target.parents(node.uniqueId);
                const st = getString(node, [history, parents])
                log(st);
            }

            /// targetからつながっているノードの更新
            let nextTarget: RDNode | null = null
            let waitNodes: RDNode[] = []
            target.to.forEach((n) => {                
                if (!n.to) {
                    return
                } 
                if (n.to.closed) {
                    return
                }
                if (nextTarget == null) {
                    nextTarget = n.to
                }
                const fromStart = target!.fromStart! + n.distance
                if (n.to.fromStart == null || n.to.fromStart > fromStart) {
                    n.to.fromStart = fromStart
                }

                if (nextTarget.fromStart == null || nextTarget.fromStart > n.to.fromStart) {
                    if (nextTarget) {
                        waitNodes.push(nextTarget);
                    }
                    nextTarget = n.to                
                } else {
                    waitNodes.push(n.to);
                }
            })
            if (nextTarget!=null) {
                target.closed = true

                if (nextTarget!.uniqueId == goal) {
                    logDebug("find!")
                    return { result: nextTarget, history: history }
                }



                list.push(nextTarget)                
            }
            waitNodes.forEach((n) => {
                list.push(n)
            })
        }
    }



}


//Tree.treeTest()
RDNode.treeTest()