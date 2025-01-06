import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Info,
  Share2,
  Download,
  Bookmark,
  Copy,
  ExternalLink,
  Clock,
  Tag,
  ArrowUpRight,
} from 'lucide-react';

const RightSidebar = ({ selectedMandala, selectedHymn, data }) => {
  // Placeholder data - replace with real data from your API
  const hymnDetails = {
    id: '1.1',
    title: 'Agni Sukta',
    meter: 'Gayatri',
    verses: 9,
    deities: ['Agni'],
    rishi: 'Madhucchandas Vaisvamitra',
    dateComposed: 'c. 1500-1200 BCE',
    themes: ['Devotion', 'Fire ritual', 'Divine invocation'],
    readingTime: '3 min',
    translations: 12,
    commentaries: 8,
    lastUpdated: '2 days ago',
  };

  const relatedHymns = [
    { id: '1.12', title: 'To Agni', similarity: 89 },
    { id: '1.13', title: 'Praise of Agni', similarity: 82 },
    { id: '1.26', title: 'Agni Invocation', similarity: 75 },
  ];

  return (
    <Box sx={{ height: '100%', overflow: 'auto', py: 3, px: 2 }}>
      {selectedMandala && selectedHymn ? (
        <>
          {/* Hymn Information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {hymnDetails.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Mandala {selectedMandala.value}, Hymn {selectedHymn.value}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip 
                label={hymnDetails.meter} 
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Chip 
                label={`${hymnDetails.verses} verses`}
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Share2 size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Download size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Bookmark size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Copy size={18} />
              </IconButton>
            </Box>
          </Paper>

          {/* Quick Stats */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Box>
                <Typography variant="h6">{hymnDetails.translations}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Translations
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{hymnDetails.commentaries}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Commentaries
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{hymnDetails.verses}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Verses
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Metadata */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Rishi"
                  secondary={hymnDetails.rishi}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Date Composed"
                  secondary={hymnDetails.dateComposed}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Deities"
                  secondary={hymnDetails.deities.join(', ')}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Reading Time"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={14} />
                      {hymnDetails.readingTime}
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>

          {/* Themes */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Themes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {hymnDetails.themes.map((theme, index) => (
                <Chip
                  key={index}
                  label={theme}
                  size="small"
                  icon={<Tag size={14} />}
                  sx={{ bgcolor: 'primary.50' }}
                />
              ))}
            </Box>
          </Paper>

          {/* Related Hymns */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Related Hymns
            </Typography>
            <List dense>
              {relatedHymns.map((hymn) => (
                <ListItem
                  key={hymn.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {hymn.similarity}% similar
                      </Typography>
                      <ArrowUpRight size={14} />
                    </Box>
                  }
                >
                  <ListItemText
                    primary={hymn.title}
                    secondary={`Hymn ${hymn.id}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Last Updated */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Last updated {hymnDetails.lastUpdated}
            </Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Info size={40} style={{ opacity: 0.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Select a hymn to view details
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RightSidebar;