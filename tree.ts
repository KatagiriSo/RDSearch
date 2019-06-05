// Created by KatagiriSo(Rodhos Soft)

export namespace Tree {

    let output = true
    let debug = false

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

    function logList(ls: Tree[]) {
        const strlist = ls.map((n) => n.value)
        log(strlist.join(" "))
    }



    class Tree implements Identifier {
        id: "Tree" = "Tree"
        left: Tree | null = null
        right: Tree | null = null
        parent: Tree | null = null
        value: string
        constructor(value: string) {
            this.value = value
        }
        toString(typ: "dot" = "dot"): string {
            let ret = ""
            if (this.left) {
                ret += this.value + " -> " + this.left.value + " ;\n"
                ret += this.left.toString(typ)
            }
            if (this.right) {
                ret += this.value + " -> " + this.right.value + " ;\n"
                ret += this.right.toString(typ)
            }
            return ret
        }

        parents(): Tree[] {
            if (this.parent == null) {
                return [this];
            }
            let ret = this.parent.parents()
            ret.push(this)
            return ret
        }




    }

    function setTree(target: Tree, item: Tree): boolean {
        if (target.left == null) {
            target.left = item
            item.parent = target
            return true
        }
        if (target.right == null) {
            target.right = item
            item.parent = target
            return true
        }

        if (setTree(target.left, item)) {
            return true
        }

        if (setTree(target.right, item)) {
            return true
        }
        return false
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

    function popRandomPair<T>(ls: T[]): { first: T, second: T | null } | null {
        if (ls.length == 0) {
            return null
        }

        return { first: popRandom(ls)!, second: popRandom(ls) }
    }

    function makeRandomTree(ls: Tree[]): Tree | null {
        logDebug("makeRandomTree:" + ls.length)
        ifdebug(() => {
            logList(ls)
        })
        if (ls.length == 0) {
            return null
        }
        if (ls.length == 1) {
            return ls[0]
        }
        const parent = popRandom(ls)!
        // log("parent"+parent.value)
        const childs = popRandomPair(ls)
        if (childs == null) {
            return parent;
        }

        setTree(parent, childs.first)
        if (childs.second) {
            setTree(parent, childs.second)
        }

        ls.push(parent)
        return makeRandomTree(ls)
    }

    function getString(tree: Tree, lines: Tree[][] = [], typ: "dot" = "dot") {
        let list: string[] = []
        const first = "digraph graph_name {\n"
        list.push(first)

        const edge = "edge [style = \"solid\"];"
        list.push(edge)

        const node = "node [color = \"#000000\"];"
        list.push(node)

        const colorList = ["\"#00FF00\"", "\"#FF0000\"","\"#0000FF\""]
        if (lines.length != 0) {
            lines.forEach((line) => {
                let color = colorList.shift()
                if (!color) {
                    color = "\"#888888\""
                }
                line.forEach((t) => {
                    const el = t.value + ` [color=${color}] ;\n`
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



    function getNumberTrees(num: number): Tree[] {
        const nums = getNumberList(num)
        const trees = nums.map((num) => {
            return new Tree(num.toString())
        })
        return trees
    }


    function sampleNetwork(num: number): Tree {
        return makeRandomTree(getNumberTrees(num))!
    }

    export function treeTest() {
        const trees = getNumberTrees(1000)
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

        const r = makeRandomTree(trees)
        console.log(getString(r!))
    }



    export function searchTest() {
        const num = 1000;
        const tree = makeRandomTree(getNumberTrees(num))!

        const target = Math.floor(Math.random() * num)
        // console.log("SerchTarget:"+target)
        const result = search_DepthFirst(target.toString(), tree)
        if (result.result != null) {
            const resStr = getString(tree, [result.hisotry, result.result.parents()]);
            console.log(resStr);
        } else {
            console.log("not found...")
        }

    }

    function search_DepthFirst(value: string, tree: Tree): {result:Tree | null, hisotry:Tree[]} {
        let list: Tree[] = [tree]
        let　history:Tree[] = []

        while (true) {
            logDebug("Search:")
            ifdebug(() => { logList(list) })
            const target = list.pop()
            if (!target) {
                return {result:null, hisotry:history}
            }
            history.push(target)
            if (target.value == value) {
                return {result:target, hisotry:history}
            }
            if (target.left) {
                list.push(target.left)
            }
            if (target.right) {
                list.push(target.right)
            }
        }
    }



}


//Tree.treeTest()
Tree.searchTest()