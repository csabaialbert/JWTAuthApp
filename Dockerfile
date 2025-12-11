# Dockerfile

# A .NET futtatókörnyezet (Runtime) Image-e
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

# Konténer munkakönyvtárának beállítása
WORKDIR /app

# Másolás: A Docker Build parancs argumentumként kapja meg a publikált könyvtárat.
# A GitHub Actions-ben beállítjuk: BUILD_ARGS-ként a PUBLISH_DIR=publish_input/API/publish_output-t
ARG PUBLISH_DIR
# A fájlokat innen másoljuk a konténer /app könyvtárába.
COPY ${PUBLISH_DIR}/ .

# A belépési pont beállítása
ENTRYPOINT ["dotnet", "API.dll"] 
# KÉRDÉS: A DLL neve