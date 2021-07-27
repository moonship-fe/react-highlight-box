import * as React from "react";
import {refractor} from "refractor";
import extras from "refractor/lang/js-extras";
import jsx from "refractor/lang/jsx";
import {last, omit} from "lodash";
import classnames from 'classnames';
import './index.css'

interface Props {
    lang: string,
    source: string
}

export const clone = (path: Record<any, any>[]) => path.map((node) => ({...node}));

export const replace = (path: any, leaf: any) => [...clone(path.slice(0, -1)), leaf];

const treeToPathList = (node: Record<string, any>, output = [], path = []) => {
    const nodeToUse = omit(node, 'children');

    if (node.children) {
        // @ts-ignore
        path.push(nodeToUse);
        for (const child of node.children) {
            treeToPathList(child, output, path);
        }
        path.pop();
    } else {
        // @ts-ignore
        output.push(clone([...path.slice(1), nodeToUse]));
    }

    return output;
};
// @ts-ignore
const splitPathToLines = path => {
    const leaf = last(path);
    // @ts-ignore
    if (!leaf.value.includes('\n')) {
        return [path];
    }

    // @ts-ignore
    const linesOfText = leaf.value.split('\n');
    // @ts-ignore
    return linesOfText.map(line => replace(path, {...leaf, value: line}));
};

// @ts-ignore
const splitByLineBreak = paths => paths.reduce(
    // @ts-ignore
    (lines, path) => {
        const currentLine = last(lines);
        const [currentRemaining, ...nextLines] = splitPathToLines(path);
        return [
            ...lines.slice(0, -1),
            // @ts-ignore
            [...currentLine, currentRemaining],
            // @ts-ignore
            ...nextLines.map(path => [path]),
        ];
    },
    [[]]
);
// @ts-ignore
const toTokenTree = tree => {
    const paths = treeToPathList(tree);
    const linesOfPaths = splitByLineBreak(paths);
    return linesOfPaths;
};

export const CodeHighlight: React.FC<Props> = (props) => {
    const {lang, source} = props;
    refractor.register(extras)
    refractor.register(jsx);
    const tokenTree = toTokenTree(refractor.highlight(source, lang));
// @ts-ignore
    const td = (item) => {
        // @ts-ignore
        return item.map(token => {
            const textToken: any = last(token);
            const className: string[] = token[0]?.properties?.className || [];
            return <span className={classnames(...className)}>{textToken.value}</span>
        })
    }

    return (
        <div className="App">
            <table>
                <tbody>
                {
                    // @ts-ignore
                    tokenTree.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td style={{whiteSpace: 'pre-wrap'}}>
                                    {td(item)}
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
}
