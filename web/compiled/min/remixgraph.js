String.prototype.trunc=String.prototype.trunc||function(n){return this.length>n?this.substr(0,n-1)+"...":this};var RemixGraph=function(){var instance=null;return{getInstance:function(){return null==instance&&(instance=new _InternalRemixGraph),instance}}}(),_InternalRemixGraph=function(){var self=this;self.remixGraphLayerId=null,self.clusterIndex=0,self.clusters=[],self.lastClusterZoomLevel=0,self.clusterFactor=0,self.network=null,self.nodes=null,self.edges=null,self.unavailableNodes=[],self.closeButtonSelector=null,self.remixGraphTranslations=null,self.programDetailsUrlTemplate=null,self.init=function(modalLayerId,remixGraphLayerId,closeButtonClassName,programDetailsUrlTemplate,remixGraphTranslations){self.reset(),self.remixGraphLayerId=remixGraphLayerId,self.closeButtonSelector=$("."+closeButtonClassName),self.remixGraphTranslations=remixGraphTranslations,self.programDetailsUrlTemplate=programDetailsUrlTemplate,$('<div id="context-menu" class="context-menu-trigger" style="display:none;"></div>').appendTo("#"+modalLayerId)},self.getNodes=function(){return self.nodes},self.getEdges=function(){return self.edges},self.reset=function(){self.clusterIndex=0,self.clusters=[],self.lastClusterZoomLevel=0,self.clusterFactor=.9,self.network=null,self.nodes=new vis.DataSet,self.edges=new vis.DataSet,self.unavailableNodes=[]},self.destroy=function(){self.reset(),null!==self.network&&(self.network.destroy(),self.network=null)},self.render=function(remixData,loadingAnimation){loadingAnimation.show(),$("body").css("overflow","hidden");for(var scratchBaseImageUrl="https://cdn2.scratch.mit.edu/get_image/project/{}_140x140.png",nodesData=[],edgesData=[],hasGraphCycles=remixData.remixGraph.catrobatBackwardEdgeRelations.length>0,nodeIndex=0;nodeIndex<remixData.remixGraph.catrobatNodes.length;nodeIndex++){var nodeId=parseInt(remixData.remixGraph.catrobatNodes[nodeIndex]),nodeData={id:"catrobat_"+nodeId,borderWidth:nodeId==remixData.id?6:3,size:nodeId==remixData.id?60:30,shape:"circularImage",image:remixData.catrobatProgramThumbnails[nodeId]};if(nodeId in remixData.remixGraph.catrobatNodesData){var programData=remixData.remixGraph.catrobatNodesData[nodeId];nodeData.label=programData.name.trunc(15),nodeData.name=programData.name.trunc(20),nodeData.username=programData.username}else self.unavailableNodes.push(nodeId);nodesData.push(nodeData)}for(var nodeIndex=0;nodeIndex<remixData.remixGraph.scratchNodes.length;nodeIndex++){var nodeId=parseInt(remixData.remixGraph.scratchNodes[nodeIndex]),unavailableProgramData={name:remixGraphTranslations.programNotAvailable,username:remixGraphTranslations.programUnknownUser},programData=unavailableProgramData,programImageUrl="/images/default/not_available.png";nodeId in remixData.remixGraph.scratchNodesData&&(programData=remixData.remixGraph.scratchNodesData[nodeId],programImageUrl=scratchBaseImageUrl.replace("{}",nodeId)),nodesData.push({id:"scratch_"+nodeId,label:"[Scratch] "+programData.name.trunc(10),name:programData.name.trunc(20),username:programData.username,shape:"circularImage",image:programImageUrl})}for(var edgeIndex=0;edgeIndex<remixData.remixGraph.catrobatForwardEdgeRelations.length;++edgeIndex){var edgeData=remixData.remixGraph.catrobatForwardEdgeRelations[edgeIndex];edgesData.push({from:"catrobat_"+edgeData.ancestor_id,to:"catrobat_"+edgeData.descendant_id})}for(var edgeIndex=0;edgeIndex<remixData.remixGraph.catrobatBackwardEdgeRelations.length;++edgeIndex){var edgeData=remixData.remixGraph.catrobatBackwardEdgeRelations[edgeIndex];edgesData.push({from:"catrobat_"+edgeData.ancestor_id,to:"catrobat_"+edgeData.descendant_id})}for(var edgeIndex=0;edgeIndex<remixData.remixGraph.scratchEdgeRelations.length;++edgeIndex){var edgeData=remixData.remixGraph.scratchEdgeRelations[edgeIndex];edgesData.push({from:"scratch_"+edgeData.ancestor_id,to:"catrobat_"+edgeData.descendant_id})}self.nodes.add(nodesData),self.edges.add(edgesData);var data={nodes:self.nodes,edges:self.edges},layoutOptions={improvedLayout:!0};hasGraphCycles?layoutOptions.randomSeed=42:layoutOptions.hierarchical={parentCentralization:!0,sortMethod:"directed"};var options={nodes:{labelHighlightBold:!1,borderWidth:3,borderWidthSelected:3,size:30,color:{border:"#CCCCCC",background:"#FFFFFF",highlight:{border:"#CCCCCC"}},font:{size:10,color:"#CCCCCC"},shapeProperties:{useBorderWithImage:!0}},layout:layoutOptions,edges:{labelHighlightBold:!1,color:{color:"#ffffff",highlight:"#ffffff",hover:"#ffffff",opacity:1},smooth:{type:"horizontal"},arrows:{to:!0}},physics:{adaptiveTimestep:!1,stabilization:!0},interaction:{dragNodes:!1,dragView:!0,hideEdgesOnDrag:!0,hideNodesOnDrag:!1,hover:!1,hoverConnectedEdges:!1,keyboard:{enabled:!0,speed:{x:20,y:20,zoom:.1},bindToWindow:!0},multiselect:!1,navigationButtons:!0,selectable:!0,selectConnectedEdges:!1,zoomView:!0}};self.network=new vis.Network(document.getElementById(self.remixGraphLayerId),data,options),self.network.setData(data),self.nodes.update([{id:"catrobat_"+remixData.id,color:{border:"#FFFF00"}}]);self.network.on("click",self.onClick),self.network.on("afterDrawing",function(){loadingAnimation.hide()}),self.network.fit({animation:!1})},self.clusterById=function(){var data={nodes:self.nodes,edges:self.edges};self.network.setData(data);for(var clusterOptionsByData,colors=["orange","lime","DarkViolet"],i=0;i<colors.length;i++){var color=colors[i];clusterOptionsByData={joinCondition:function(childOptions){var parts=childOptions.id.split("_");return"scratch"!=parts[0]&&parseInt(parts[1])>=100},processProperties:function(clusterOptions,childNodes,childEdges){for(var totalMass=0,i=0;i<childNodes.length;i++)totalMass+=childNodes[i].mass;return clusterOptions.mass=totalMass,clusterOptions},clusterNodeProperties:{id:"cluster:"+color,borderWidth:3,shape:"database",color:color,label:"100 programs"}},self.network.cluster(clusterOptionsByData)}},self.clusterize=function(){var clusterOptionsByData={processProperties:function(clusterOptions,childNodes){self.clusterIndex=self.clusterIndex+1;for(var childrenCount=0,i=0;i<childNodes.length;i++)childrenCount+=childNodes[i].childrenCount||1;return clusterOptions.childrenCount=childrenCount,clusterOptions.label="# "+childrenCount,clusterOptions.font={size:5*childrenCount+30},clusterOptions.id="cluster:"+clusterIndex,self.clusters.push({id:"cluster:"+clusterIndex,scale:scale}),clusterOptions},clusterNodeProperties:{borderWidth:3,shape:"database",font:{size:30}}};self.network.clusterOutliers(clusterOptionsByData),self.network.setOptions({physics:{stabilization:{fit:!1}}}),self.network.stabilize()},self.onClick=function(params){var overlayDiv=$("<div></div>").attr("id","overlay").addClass("overlay");overlayDiv.appendTo("body"),setTimeout("$('#overlay').remove();",300);var selectedNodes=params.nodes;if(self.edges.forEach(function(edgeData){self.edges.update([{id:edgeData.id,color:{opacity:1}}])}),0!=selectedNodes.length){var selectedNodeId=selectedNodes[0],idParts=selectedNodeId.split("_"),nodeId=parseInt(idParts[1]);if($.inArray(nodeId,self.unavailableNodes)!=-1)return void swal({title:self.remixGraphTranslations.programNotAvailableErrorTitle,text:self.remixGraphTranslations.programNotAvailableErrorDescription,type:"error",showCancelButton:!1,confirmButtonText:self.remixGraphTranslations.ok,closeOnConfirm:!0},function(){$("#overlay").remove()});var domPosition=params.pointer.DOM,menuWidth=220,offsetX=-menuWidth/2,selectedNodeData=self.nodes.get(selectedNodeId),selectedEdges=self.network.getConnectedEdges(selectedNodeId);$.contextMenu("destroy"),$.contextMenu({selector:".context-menu-trigger",trigger:"left",className:"data-title",events:{show:function(opt){},hide:function(opt){}},callback:function(key,options){var m="clicked: "+key;window.console&&console.log(m)||alert(m)},position:function(opt,x,y){var windowWidth=$(window).width();if(windowWidth>1024)opt.$menu.css({top:domPosition.y,left:offsetX+domPosition.x});else{var width=Math.max(windowWidth-100,200),height=opt.$menu.css("height").replace("px","");opt.$menu.css({top:"50%",left:"50%",width:width,maxWidth:width,marginTop:-height/2,marginLeft:-width/2})}},items:{title:{name:"<b>"+selectedNodeData.name+"</b>",isHtmlName:!0,className:"context-menu-item-title context-menu-not-selectable"},subtitle:{name:self.remixGraphTranslations.by+" "+selectedNodeData.username,isHtmlName:!0,className:"context-menu-item-subtitle context-menu-not-selectable"},sep1:"---------",open:{name:self.remixGraphTranslations.open,icon:"fa-external-link",callback:function(){self.closeButtonSelector.click();var newUrlPrefix="catrobat"==idParts[0]?self.programDetailsUrlTemplate.replace("0",""):"https://scratch.mit.edu/projects/";window.location=newUrlPrefix+nodeId}},edges:{name:self.remixGraphTranslations.showPaths,icon:"fa-retweet",callback:function(){self.edges.forEach(function(edgeData){selectedEdges.indexOf(edgeData.id)==-1?self.edges.update([{id:edgeData.id,color:{opacity:.1}}]):self.edges.update([{id:edgeData.id,color:{opacity:1}}])})}}}}),$("#context-menu").click()}},self.makeClusters=function(scale){var clusterOptionsByData={processProperties:function(clusterOptions,childNodes){clusterIndex+=1;for(var childrenCount=0,i=0;i<childNodes.length;i++)childrenCount+=childNodes[i].childrenCount||1;return clusterOptions.childrenCount=childrenCount,clusterOptions.label="# "+childrenCount,clusterOptions.font={size:5*childrenCount+30},clusterOptions.id="cluster:"+clusterIndex,clusters.push({id:"cluster:"+clusterIndex,scale:scale}),clusterOptions},clusterNodeProperties:{borderWidth:3,shape:"database",font:{size:30}}};self.network.clusterOutliers(clusterOptionsByData),self.network.setOptions({physics:{stabilization:{fit:!1}}}),self.network.stabilize()},self.openClusters=function(scale){for(var newClusters=[],declustered=!1,i=0;i<clusters.length;i++)clusters[i].scale<scale?(self.network.openCluster(clusters[i].id),self.lastClusterZoomLevel=scale,declustered=!0):newClusters.push(clusters[i]);self.clusters=newClusters,declustered===!0&&(self.network.setOptions({physics:{stabilization:{fit:!1}}}),self.network.stabilize())}};