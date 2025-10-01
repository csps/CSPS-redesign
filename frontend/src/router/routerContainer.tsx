import { useRoutes } from "react-router-dom"
import routes from "./routes"
import { Suspense } from "react";

const RouterCounter = () => {
    const elements = useRoutes(routes);

    return <Suspense>{elements}</Suspense>
}

export default RouterCounter;