import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * This functional component creates a tab panel to switch between multiple pages.
 *
 * @param props - Properties used for the tab panel
 */
export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function indexedTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}