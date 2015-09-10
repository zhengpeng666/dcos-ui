import React from "react/addons";

import DetailSidePanel from "./DetailSidePanel";
import MesosSummaryStore from "../stores/MesosSummaryStore";

export default class NodeSidePanel extends DetailSidePanel {
  getContents() {
    let last = MesosSummaryStore.get("states").last();
    let node = last.getNodesList().filter({ids: [this.props.nodeID]}).last();

    if (node == null) {
      return (
        <div>
          <h2 className="text-align-center inverse overlay-header">
            Error finding node
          </h2>
          <div className="container container-pod text-align-center flush-top text-danger">
            {`Did not find a node with the id "${this.props.nodeID}"`}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-align-center inverse overlay-header">
          {node.hostname}
        </h2>
      </div>
    );
  }
}

NodeSidePanel.propTypes = {
  nodeID: React.PropTypes.string
};
