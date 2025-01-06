import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import {
  ChevronDown,
  ChevronRight,
  Book,
  FileText,
} from 'lucide-react';

const LeftSidebar = ({
  selectedMandala,
  onMandalaSelect,
  selectedHymn,
  onHymnSelect,
  loading,
  mandalas = []
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Prepare navigation data
  const navItems = [
    {
      title: 'Ramayana',
      items: [
        {
          title: 'Bala Kanda',
          items: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            title: `Chapter ${i + 1}`,
            path: `/ramayana/bala-kanda/${i + 1}`,
            onClick: () => onHymnSelect(i + 1)
          }))
        },
        {
          title: 'Ayodhya Kanda',
          items: Array.from({ length: 10 }, (_, i) => ({
            id: i + 11,
            title: `Chapter ${i + 1}`,
            path: `/ramayana/ayodhya-kanda/${i + 1}`,
            onClick: () => onHymnSelect(i + 11)
          }))
        }
      ]
    },
    {
      title: 'Vedas',
      items: mandalas.map(mandala => ({
        id: mandala.id,
        title: `Mandala ${mandala.id}`,
        onClick: () => onMandalaSelect(mandala.id),
        items: mandala.hymns?.map(hymn => ({
          id: hymn.id,
          title: `Hymn ${hymn.id}`,
          onClick: () => onHymnSelect(hymn.id)
        }))
      }))
    }
  ];

  const renderSection = (title, items, level = 0) => {
    const isExpanded = expandedItems.has(title);
    
    return (
      <>
        <ListItemButton
          onClick={() => toggleExpanded(title)}
          sx={{
            pl: level * 2 + 2,
            py: 1,
            minHeight: 40,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {level === 0 ? (
              <Book size={18} />
            ) : (
              <FileText size={18} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={title}
            primaryTypographyProps={{
              variant: 'body2',
              color: 'text.primary',
              fontWeight: level === 0 ? 600 : 400,
            }}
          />
          {items && items.length > 0 && (
            isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )
          )}
        </ListItemButton>
        
        {items && items.length > 0 && (
          <Collapse in={isExpanded} timeout="auto">
            <List disablePadding>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.items ? (
                    renderSection(item.title, item.items, level + 1)
                  ) : (
                    <ListItemButton
                      selected={selectedHymn === item.id}
                      onClick={() => item.onClick?.()}
                      sx={{ 
                        pl: (level + 1) * 2 + 2,
                        minHeight: 36,
                        '&.Mui-selected': {
                          bgcolor: 'primary.lighter',
                          '&:hover': {
                            bgcolor: 'primary.light',
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItemButton>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          px: 3,
          py: 2,
          display: 'block',
          color: 'text.secondary',
          fontWeight: 600,
        }}
      >
        NAVIGATION
      </Typography>
      <List disablePadding>
        {navItems.map((section, index) => (
          <React.Fragment key={index}>
            {renderSection(section.title, section.items)}
          </React.Fragment>
        ))}
      </List>
      {loading && (
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LeftSidebar;