import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { ResponsiveNetwork } from '@nivo/network';

const RelationshipGraphTab = ({ hymns = [] }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    if (!hymns.length) return;

    const extractEntities = (text) => {
      // Simple entity extraction - look for capitalized words
      const entities = text.match(/[A-Z][a-z]+/g) || [];
      return [...new Set(entities)];
    };

    const processHymns = () => {
      const nodes = new Set();
      const links = new Set();

      hymns.forEach(hymn => {
        hymn.verses.forEach(verse => {
          const entities = extractEntities(verse.translation);
          
          // Add nodes
          entities.forEach(entity => {
            nodes.add(entity);
          });

          // Add links between entities in the same verse
          for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
              links.add(JSON.stringify({
                source: entities[i],
                target: entities[j]
              }));
            }
          }
        });
      });

      return {
        nodes: Array.from(nodes).map(id => ({ 
          id,
          radius: 8,
          depth: 1,
          color: "rgb(97, 205, 187)"
        })),
        links: Array.from(links).map(link => {
          const parsed = JSON.parse(link);
          return {
            source: parsed.source,
            target: parsed.target,
            distance: 50
          };
        })
      };
    };

    setGraphData(processHymns());
  }, [hymns]);

  if (!hymns.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
        <Typography variant="h6">Select hymns to visualize relationships</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: 'calc(100vh - 200px)' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Concept Relationships
        </Typography>
        <Box sx={{ height: 'calc(100% - 40px)', bgcolor: 'background.default' }}>
          <ResponsiveNetwork
            data={graphData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            linkDistance={function(e){return e.distance}}
            centeringStrength={0.3}
            repulsivity={6}
            nodeSize={function(n){return n.size}}
            activeNodeSize={function(n){return 1.5*n.size}}
            nodeColor={function(e){return e.color}}
            nodeBorderWidth={1}
            nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
            linkThickness={function(n){return 2 + 2*n.target.data.height}}
            linkBlendMode="multiply"
            motionConfig="wobbly"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RelationshipGraphTab;