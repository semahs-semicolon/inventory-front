export const injectParentLink = (tree) => {
    injectParent(tree, undefined);
    return tree;
}

export const searchId = (tree, id) => {
    if (tree?.id === id) return tree;
    for (const child of tree.children) {
        const res = searchId(child, id);
        if (res !== undefined) return res;
    }
    return undefined;
}

export const findsParent = (child, parentId) => {
    while (child != null) {
        if (child.id == parentId) return true;
        child = child.parent;
    }
    return false;
}

const injectParent = (tree, parent) => {
    tree.parent = parent;
    for (const child of tree.children) {
        injectParent(child, tree);
    }
}