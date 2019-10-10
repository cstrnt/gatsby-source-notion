const Notion = require('notion-api-js').default;

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;

  const processPage = page => {
    const nodeId = createNodeId(`notion-page-${page.Attributes.id}`);
    const nodeContent = JSON.stringify(page.HTML);
    const nodeData = Object.assign({}, page, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `NotionPage`,
        content: nodeContent,
        contentDigest: createContentDigest(page),
      },
    });
    return nodeData;
  };
  const api = new Notion({ token: configOptions.token });
  return api
    .getPagesByIndexId(configOptions.indexPageId)
    .then(p => p.slice(1).forEach(page => createNode(processPage(page))));
};
