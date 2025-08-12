import { MenuItem, Select } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useLocation } from "react-router-dom";

const TransactionsNav = () => {
  const location = useLocation();

  const handleRenderTest = () => {
    switch (location.pathname) {
      case "/transactions":
        return (
          <Select
            id="demo-controlled-open-select"
            variant="standard"
            disableUnderline
            displayEmpty
            value="" // default to empty for placeholder
            sx={{
              backgroundColor: "transparent",
              color: "white",
              fontSize: "1rem",
              "& .MuiSelect-icon": {
                color: "white",
              },
              "& .MuiInput-input": {
                padding: "8px 12px",
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Type</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        );
      case "/merch":
        return (
          <Select
            id="demo-controlled-open-select"
            variant="standard"
            disableUnderline
            displayEmpty
            value="" // default to empty for placeholder
            sx={{
              backgroundColor: "transparent",
              color: "white",
              fontSize: "1rem",
              "& .MuiSelect-icon": {
                color: "white",
              },
              "& .MuiInput-input": {
                padding: "8px 12px",
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Type</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        );
      case "/cart":
        return (
          <p className="bg-white px-6 py-2 text-2xl lg:text-4xl rounded-full text-black font-semibold">
            All
          </p>
        );
    }
  };

  return (
    <div className=" w-full absolute top-10 lg:top-20 flex justify-between items-center">
      {handleRenderTest()}

      <div className="flex gap-5 text-white px-15">
        <Link to="/transactions">
          <ReceiptIcon fontSize="large" />
        </Link>
        <Link to="/cart">
          <ShoppingCartIcon fontSize="large" />
        </Link>
      </div>
    </div>
  );
};

export default TransactionsNav;
