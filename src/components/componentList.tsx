import React, { useState, useEffect } from "react";
import registryJSON from "../../registry.json";

function ComponentRegistry() {
  const [componentMap, setComponentMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadComponents() {
      try {
        const loadedComponents = {};

        // Load each component from the registry
        for (const item of registryJSON.items) {
          const filePath = item.files[0].path;

          try {
            // Dynamic import of the component
            const module = await import(`../../${filePath}`);

            // Try different export patterns
            const componentName =
              item.name.charAt(0).toUpperCase() + item.name.slice(1);
            let Component = null;

            if (module[componentName]) {
              Component = module[componentName];
              console.log(
                `Found component with capitalized name: ${componentName}`
              );
            } else if (module[item.name]) {
              Component = module[item.name];
              console.log(`Found component with original name: ${item.name}`);
            } else if (module.default) {
              Component = module.default;
              console.log(`Found default export for: ${item.name}`);
            } else {
              console.error(
                `Could not find component export in module for: ${item.name}`
              );
            }

            if (Component) {
              loadedComponents[item.name] = {
                Component,
                item,
              };
            }
          } catch (err) {
            console.error(`Error loading component ${item.name}:`, err);
          }
        }

        setComponentMap(loadedComponents);
      } catch (err) {
        setError(err.message);
        console.error("Error loading components:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadComponents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-pulse">Loading components...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-red-400 font-medium">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Component Registry
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Discover and use beautiful, reusable components
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Object.values(componentMap) as { item: any; Component: any }[]).map(
            ({ item, Component }) => (
              <div
                key={item.name}
                className="border border-gray-800 rounded-xl p-6 bg-gray-700 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10"
              >
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <p className="text-gray-400 mb-6 text-sm">{item.description}</p>

                <div className="p-5 border  rounded-lg skin backdrop-blur-sm">
                  <div className="flex justify-center items-center p-4 min-h-[120px]">
                    {item.name === "card" ? (
                      <Component
                        content="This is sample content for the card component."
                        buttonText="Click Me"
                      />
                    ) : item.name === "button" ? (
                      <Component title="Sample Button" />
                    ) : (
                      <Component />
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ComponentRegistry;
