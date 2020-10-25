import React from "react";
import { Context } from "@foundation/umbracoContent/typings";
import Link from "@foundation/shared-components/Link";

interface SiteLayoutProps {
  context?: Context;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ context, children }) => {
  const navigation = context?.settings?.pageNavigation?.navigation;

  return (
    <>
      {navigation && (
        <nav>
          <ul>
            {navigation.map((nav) => (
              <li key={nav.url}>
                <Link {...nav} />
              </li>
            ))}
          </ul>
        </nav>
      )}
      <main>{children}</main>
    </>
  );
};

export default SiteLayout;
