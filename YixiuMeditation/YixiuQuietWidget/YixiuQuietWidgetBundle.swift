import SwiftUI
import WidgetKit

@main
struct YixiuQuietWidgetBundle: WidgetBundle {
    var body: some Widget {
        QuietMinuteWidget()
        OneMinuteControl()
        QuietMinuteLiveActivity()
    }
}
