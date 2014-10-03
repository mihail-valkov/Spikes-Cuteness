declare module "utils/utils" {
    module ad {
        module collections {
            function stringArrayToStringSet(str: string[]): any;
            function stringSetToStringArray(stringSet: any): string[];
        }

        module layout {
            function getDevicePixels(independentPixels: number, context: android.content.Context): number;
        }

        module id {
            var home: number;
        }

        module resources {
            function getDrawableId(name);
            function getStringId(name)
            function getId(name: string): number;
        }

        function async<T>(doInBackground: () => T, callback: (result: T) => void);
    }

    module ios {
        module collections {
            function jsArrayToNSArray(str: string[]): any;
            function nsArrayToJSArray(a: any): string[];
        }
    }
}