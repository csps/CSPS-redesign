import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import PageLoader from "@/components/shared/PageLoader";

function RouteContainer() {
  const elements = useRoutes(routes);

  return <Suspense fallback={<PageLoader />}>{elements}</Suspense>;
}

export default RouteContainer;
