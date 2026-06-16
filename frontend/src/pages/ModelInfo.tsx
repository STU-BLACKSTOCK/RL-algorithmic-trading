import { useEffect, useState } from "react";
import api from "../services/api";

import type { ModelInfo as ModelInfoType } from "../types/model";

function ModelInfo() {

  const [modelInfo, setModelInfo] =
    useState<ModelInfoType | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchModelInfo =
      async () => {

        try {

          const response =
            await api.get(
              "/model-info"
            );

          setModelInfo(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );

        } finally {

          setLoading(
            false
          );
        }
      };

    fetchModelInfo();

  }, []);

  if (loading) {

    return (
      <h2>
        Loading...
      </h2>
    );
  }

  return (

    <div>

      <h1>
        Model Information
      </h1>

      <p>
        <strong>
          Model:
        </strong>{" "}
        {modelInfo?.model}
      </p>

      <p>
        <strong>
          Lookback Window:
        </strong>{" "}
        {modelInfo?.lookback_window}
      </p>

      <p>
        <strong>
          Action Space:
        </strong>{" "}
        {modelInfo?.action_space}
      </p>

      <p>
        <strong>
          Loaded:
        </strong>{" "}
        {String(
          modelInfo?.loaded
        )}
      </p>

    </div>
  );
}

export default ModelInfo;